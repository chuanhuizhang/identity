const Joi = require('joi')
const Boom = require('boom')
const Config = require('config')
const halson = require('halson')
const uuidv4 = require('uuid/v4')

const Client = require('./model')
const { validateOptions } = require('../utils')

const validate = {
  ...validateOptions,
  payload: {
    name: Joi.string().required(),
    resources: Joi.array().items(Joi.string().required()).unique().required(),
    type: Joi.string().allow('web', 'spa', 'mobile').required(),
    grantTypes: Joi.array().items(Joi.string()
      .allow('client_credentials', 'password', 'refresh_token', 'authorization_code')).unique()
  }
}

function handler(request, h) {
  const clientPayload = {
    ...request.payload,
    clientKeyId: uuidv4(),
    clientKeySecret: uuidv4()
  }
  const client = new Client(clientPayload)
  return new Promise((resolve, reject) => {
    client.save((err) => {
      if (err) return reject(Boom.badImplementation(err))
      resolve(h.response(client).code(201))
    })
  })
}

const response = {
  modify: true,
  schema: async (value) => {
    const responseSchema = Joi.object({
      _id: Joi.object().required(),
      name: Joi.string().required(),
      type: Joi.string().required(),
      grantTypes: Joi.array().required(),
      roles: Joi.array().required(),
      clientKeyId: Joi.string().required(),
      clientKeySecret: Joi.string().required(),
      resources: Joi.array().required(),
      status: Joi.string().required(),
      createdAt: Joi.date().required()
    }).options({
      stripUnknown: true
    })
    const result = Joi.validate(value.toObject(), responseSchema)
    if (result.error) {
      throw Boom.badImplementation(result.error)
    }
    return halson(result.value)
      .addLink('self', `${Config.get('server.origin')}/v1.0/clients/${value._id}`)
  }
}

module.exports = {
  description: 'Creates a client(app) and responds with the client created',
  auth: {
    scope: ['user_admin', '+client_admin']
  },
  validate,
  handler,
  response
}
