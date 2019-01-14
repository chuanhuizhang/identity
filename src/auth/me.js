const Joi = require('joi')

const { validateOptions } = require('../utils')
const { response } = require('../users/create')

const validate = {
  ...validateOptions,
  headers: {
    authorization: Joi.string().required()
  }
}

function handler(request) {
  return request.auth.credentials.user
}

module.exports = {
  description: 'Return authenticated user',
  auth: {
    scope: ['user_regular', 'user_admin']
  },
  validate,
  handler,
  response
}
