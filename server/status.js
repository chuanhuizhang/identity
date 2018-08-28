const os = require('os')

module.exports = {
  path: '/status',
  method: 'GET',
  config: {
    description: 'Provides health status of running server',
    auth: false,
    cache: false
  },
  handler: () => {
    return {
      running: true,
      uptime: process.uptime(),
      memeory: process.memoryUsage(),
      loadavg: os.loadavg(),
      droneId: process.pid
    }
  }
}
