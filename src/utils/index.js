const Boom = require('boom')

const validateOptions = {
  options: {
    abortEarly: false,
    allowUnknown: true
  },
  failAction: async (request, h, err) => {
    if (process.env.NODE_ENV === 'production') {
      // In prod, log a limited error message and throw the default Bad Request error.
      // TODO: Better to use an actual logger here.
      console.error('ValidationError:', err.message)
      throw Boom.badRequest('Invalid request payload input')
    } else {
      // During development, log and respond with the full error.
      throw err
    }
  },
}

module.exports = {
  validateOptions
}
