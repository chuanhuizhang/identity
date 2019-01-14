const token = require('./token')
const signup = require('./signup')
const me = require('./me')

module.exports = [
  {
    path: '/v1.0/oauth/token',
    method: 'POST',
    config: token
  },
  {
    path: '/v1.0/signup',
    method: 'POST',
    config: signup
  },
  {
    path: '/v1.0/me',
    method: 'POST',
    config: me
  },
]
