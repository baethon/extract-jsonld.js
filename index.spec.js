const nock = require('nock')

beforeAll(() => {
  nock.disableNetConnect()
})

afterEach(() => {
  const pendingMocks = nock.pendingMocks()

  if (pendingMocks.length > 0) {
    throw new Error(`Pending mocks are not fulfilled:\n${pendingMocks.join('\n')}`)
  }

  nock.cleanAll()
})

test.skip('extracting json-ld schema from webpage', async () => {
})
