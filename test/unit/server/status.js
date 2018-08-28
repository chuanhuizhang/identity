const { expect } = require('code')
const Lab = require('lab')

const lab = Lab.script()
const { describe, it } = lab

const Status = require('../../../server/status')

describe('unit tests - status', () => {

  it('should return a status object', async () => {

    const result = Status.handler()

    expect(result.running).to.be.true()
  })
})

module.exports = {
  lab
}
