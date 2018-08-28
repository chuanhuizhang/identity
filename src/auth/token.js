const _ = require('lodash')
const Config = require('config')
const Joi = require('joi')
const Boom = require('boom')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../users/model')
const { validateOptions } = require('../utils')

const AUTH_JWT_SECRET = Config.get('auth.jwt.secret')
const AUTH_JWT_EXPIRES_IN_ACCESS_TOKEN = Config.get('auth.jwt.expiresIn.accessToken')
const AUTH_JWT_EXPIRES_IN_REFRESH_TOKEN = Config.get('auth.jwt.expiresIn.refreshToken')

const validate = {
  ...validateOptions,
  payload: {
    grantType: Joi.string().valid(
      'password',
      'refreshToken',
      'clientCredentials'
    ).required(),
    email: Joi.string().email().when('grantType', {
      is: 'password',
      then: Joi.required()
    }),
    password: Joi.string().when('grantType', {
      is: 'password',
      then: Joi.required()
    }),
    refreshToken: Joi.string().when('grantType', {
      is: 'refreshToken',
      then: Joi.required()
    })
  },
  headers: {
    authorization: Joi.string().required()
  }
}

const pre = [
  {
    assign: 'verify',
    method: (request) => {
      const { eventEmitter } = request

      if (request.payload.grantType === 'refreshToken') {
        try {
          const decoded = jwt.verify(request.payload.refreshToken, AUTH_JWT_SECRET)
          if (decoded.type !== 'refresh_token') {
            return Boom.unauthorized('Invalid refresh token')
          }
          return _.omit(decoded, ['iat', 'exp'])
        } catch (err) {
          return Boom.unauthorized('Refresh token expired, please log in again')
        }
      } else {
        return new Promise((resolve, reject) => {
          // TODO: Should accept username, email
          const client = _.get(request, 'auth.credentials.client')

          User.findOne({ email: request.payload.email }, (err, user) => {
            if (err) return reject(Boom.badImplementation(err))
            if (!user || !bcrypt.compareSync(request.payload.password, user.password)) {
              return reject(Boom.unauthorized('Invalid credentials'))
            }
            // Make sure user has the sufficient scope to the resources through the client
            if (_.isEmpty(_.intersection(user.resources, client.resources))) {
              return reject(Boom.forbidden('Insufficient scope'))
            }
            const verify = {
              clientKeyId: client.clientKeyId,
              userId: user._id,
              email: user.email
            }
            resolve(verify)
            eventEmitter.emit('user_signin', verify, { request })
          })
        })
      }
    }
  }
]

function handler(request) {
  const accessToken = jwt.sign(
    { ...request.pre.verify, type: 'access_token' },
    AUTH_JWT_SECRET,
    { expiresIn: AUTH_JWT_EXPIRES_IN_ACCESS_TOKEN }
  )
  const refreshToken = jwt.sign(
    { ...request.pre.verify, type: 'refresh_token' },
    AUTH_JWT_SECRET,
    { expiresIn: AUTH_JWT_EXPIRES_IN_REFRESH_TOKEN }
  )

  return {
    accessToken,
    tokenType: 'bearer',
    refreshToken,
    expiresIn: 3600
  }
}

module.exports = {
  description: 'Creates access token and refresh token based on grant type',
  auth: {
    scope: ['client_regular', 'client_admin']
  },
  validate,
  pre,
  handler
}
