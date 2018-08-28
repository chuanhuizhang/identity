const Joi = require('joi')

const { pre, handler, response } = require('../users/create')
const { validateOptions } = require('../utils')

const validate = {
  ...validateOptions,
  payload: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  })
}

module.exports = {
  description: 'Sign up with client(app) scope and responds with the user created',
  auth: {
    scope: ['client_regular']
  },
  validate,
  pre,
  handler,
  response
}
