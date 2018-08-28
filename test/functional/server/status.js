const { expect } = require('code')
const Lab = require('lab')

const initServer = require('../../../server/init')

const lab = Lab.script()
const { describe, it, before } = lab

describe('functional tests - status', () => {

  before(async () => {
    const server = await initServer()
    await server.initialize()
    this.server = server
  })

  it('should get status of running', async () => {
    const response = await this.server.inject({
      method: 'GET',
      url: '/status'
    })

    expect(response.statusCode).to.equal(200)
    expect(response.result.running).to.be.true()
  })
})

module.exports = {
  lab
}
