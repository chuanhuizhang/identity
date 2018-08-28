const Glue = require('glue')
const Config = require('config')
const status = require('./status')

const GOOD_OPTIONS = {
  ops: {
    interval: 3000
  },
  reporters: {
    console: [
      {
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [
          {
            log: '*', response: '*', error: '*'
          }
        ]
      }, {
        module: 'good-console'
      },
      'stdout'
    ]
  }
}

const manifest = {
  server: {
    port: Config.get('server.port')
  },
  register: {
    plugins: [
      {
        plugin: 'blipp',
        options: {}
      },
      {
        plugin: 'good',
        options: GOOD_OPTIONS
      },
      {
        plugin: '../src',
        options: {
          database: {
            uri: Config.get('db.uri')
          }
        }
      }
    ],
    options: {
      once: true
    }
  }
}

const options = {
  relativeTo: __dirname
}

const initServer = async () => {
  const server = await Glue.compose(manifest, options)
  server.route(status)
  return server
}

module.exports = initServer
