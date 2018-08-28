const _ = require('lodash')
const Config = require('config')
const Boom = require('boom')
const async = require('async')
const jwt = require('jsonwebtoken')

const Client = require('../clients/model')
const User = require('../users/model')

const AUTH_JWT_SECRET = Config.get('auth.jwt.secret')

function _verifyBasicCredentials(auth, h) {
  const clientCredentials = Buffer.from(auth[1], 'base64').toString().split(':')

  return new Promise((resolve, reject) => {
    Client.findOne({
      clientKeyId: clientCredentials[0],
      clientKeySecret: clientCredentials[1]
    }, (err, client) => {
      if (err) return reject(Boom.badImplementation(err))
      if (!client) return reject(Boom.unauthorized('Invalid credentials'))
      resolve(h.authenticated({
        credentials: {
          client,
          clientKeyId: clientCredentials[0],
          scope: client.roles
        }
      }))
    })
  })
}

function _verifyBearerCredentials(auth, h) {
  try {
    const decoded = jwt.verify(auth[1], AUTH_JWT_SECRET)
    if (decoded.type !== 'access_token') {
      return Boom.unauthorized('Invalid token')
    }
    return new Promise((resolve, reject) => {
      async.parallel({
        client: (cb) => {
          Client.findOne({
            clientKeyId: decoded.clientKeyId,
            status: 'enabled'
          }, { clientKeySecret: false }, cb)
        },
        user: (cb) => {
          User.findOne({
            _id: decoded.userId,
            status: 'enabled'
          }, { password: false }, cb)
        }
      }, (err, res) => {
        if (err) return reject(Boom.badImplementation(err))
        if (!res.user || !res.client) return reject(Boom.unauthorized('Invalid credentials'))
        return resolve(h.authenticated({
          credentials: {
            ..._.omit(decoded, ['iat', 'exp']),
            scope: [...res.user.roles, ...res.client.roles],
            user: res.user
          }
        }))
      })
    })
  } catch (err) {
    return Boom.unauthorized('Invalid token')
  }
}

const authenticate = (request, h) => {
  const { req } = request.raw
  const { authorization } = req.headers

  if (!authorization) {
    throw Boom.unauthorized('Authorization is required')
  }

  const auth = authorization.split(' ')
  if (auth[0] === 'Basic') {
    return _verifyBasicCredentials(auth, h)
  }
  if (auth[0] === 'Bearer') {
    return _verifyBearerCredentials(auth, h)
  }
  throw Boom.unauthorized('Authorization type is not allowed')
}

module.exports = () => {
  return {
    authenticate
  }
}
