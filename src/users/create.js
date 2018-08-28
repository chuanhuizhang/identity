const _ = require('lodash')
const Joi = require('joi')
const Boom = require('boom')
const Config = require('config')
const bcrypt = require('bcrypt')
const halson = require('halson')

const { validateOptions } = require('../utils')
const User = require('./model')

const validate = {
  ...validateOptions,
  payload: Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().min(2).max(20).regex(/^[a-zA-Z0-9\s'.-]*$/),
    lastName: Joi.string().min(2).max(20).regex(/^[a-zA-Z0-9\s'.-]*$/),
    fullName: Joi.string(),
    roles: Joi.array().items(Joi.string().allow('user_regular', 'user_admin')),
    resources: Joi.array().items(Joi.string().required()).unique().required(),
  }).xor('firstName', 'fullName')
}

const handler = (request, h) => {
  const { eventEmitter } = request

  const userPayload = {
    ...request.payload,
    username: request.payload.email || request.payload.phone,
    password: bcrypt.hashSync(request.payload.password, 10),
    // Use the resources of the client if sign up, or resources assigned by admnin user
    resources: _.get(request, 'auth.credentials.client.resources') || request.payload.resources,
    client: _.get(request, 'auth.credentials.client._id'),
    creator: _.get(request, 'auth.credentials.user._id')
  }
  const user = new User(userPayload)

  return new Promise((resolve, reject) => {
    user.save((err, doc) => {
      if (err) {
        if (err.code === 11000) { // Mongo duplicate error code
          return reject(Boom.conflict('User already exist'))
        }
        return reject(Boom.badImplementation(err))
      }
      resolve(h.response(doc).code(201))
      eventEmitter.emit('user_created', doc, { request })
    })
  })
}

const response = {
  modify: true,
  schema: async (value) => {
    const responseSchema = Joi.object({
      _id: Joi.object().required(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      email: Joi.string().email(),
      status: Joi.string(),
      createdAt: Joi.date()
    }).options({
      stripUnknown: true
    })
    const result = Joi.validate(value.toObject(), responseSchema)
    if (result.error) {
      throw Boom.badImplementation(result.error)
    }
    return halson(result.value)
      .addLink('self', `${Config.get('server.origin')}/v1.0/users/${value._id}`)
  }
}

module.exports = {
  description: 'Creates a user (by admin) and responds with the user created',
  auth: {
    scope: ['user_admin']
  },
  validate,
  handler,
  response
}
