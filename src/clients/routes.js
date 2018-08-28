const create = require('./create')

module.exports = [
  {
    path: '/v1.0/clients',
    method: 'POST',
    config: create
  }
]
