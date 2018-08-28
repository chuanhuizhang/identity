module.exports = {
  server: {
    origin: 'http://localhost:3001',
    port: 3001
  },
  auth: {
    jwt: {
      secret: 'your_secret',
      expiresIn: {
        accessToken: '2h',
        refreshToken: '2w'
      }
    }
  },
  code: {
    expiresIn: '1h' 
  }
}
