const create = require('./create')

module.exports = [
  {
    path: '/v1.0/users',
    method: 'POST',
    config: create
  }
]
