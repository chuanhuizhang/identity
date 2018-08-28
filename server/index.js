const initServer = require('./init')

const startServer = async () => {
  try {
    const server = await initServer()
    await server.start()
    console.log(`Server started at: ${server.info.uri}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

startServer()
