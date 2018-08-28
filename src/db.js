const mongoose = require('mongoose')

const connectDatabase = (mongoURI) => {
  mongoose.connect(mongoURI, { autoReconnect: true })

  mongoose.connection.on('error', function (error) {
    console.log('Mongo server connection error!', error)
    mongoose.disconnect()
  })

  mongoose.connection.on('connected', function () {
    console.log('MongoDB connected!')
  })

  mongoose.connection.once('open', function () {
    console.log(`Database connected to ${mongoURI}`)
  })

  mongoose.connection.on('disconnected', function () {
    console.log('Disconnected with mongo server')
  })

  mongoose.connection.on('reconnect', function () {
    console.log('Database reconnecting')
  })
}

module.exports = {
  connectDatabase
}
