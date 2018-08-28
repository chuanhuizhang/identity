const signUpEmail = require('./signUpEmail')

module.exports = (server) => {
  const { eventEmitter } = server

  eventEmitter.on('user_created', signUpEmail)
  eventEmitter.on('user_signin', () => {})
}
