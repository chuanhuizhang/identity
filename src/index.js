const EventEmitter = require('events')

const pkg = require('../package.json')
const Users = require('./users')
const Clients = require('./clients')
const Auth = require('./auth')
const { connectDatabase } = require('./db')
const integrations = require('./integrations')
const authSchema = require('./auth/schema')

const register = async function (server, options) {
  // Setup auth schema and strategy
  server.auth.scheme('accessToken', authSchema)
  server.auth.strategy('default', 'accessToken')
  server.auth.default('default')

  // Initialize database connection
  const { database } = options
  connectDatabase(database.uri)

  // Initialize event emitter and append it to request instance
  const eventEmitter = new EventEmitter()
  server.decorate('request', 'eventEmitter', eventEmitter)
  server.decorate('server', 'eventEmitter', eventEmitter)

  // Register integrations
  integrations(server)

  // Setup routes configurations
  server.route([
    ...Users.routes,
    ...Clients.routes,
    ...Auth.routes
  ])
}

module.exports = {
  pkg,
  register
}
