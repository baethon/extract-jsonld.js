const nock = require('nock')
const { extract } = require('./index')
const stubs = require('./stubs')

const testHost = 'http://some-page.com'
const createScope = (status, reply) => nock(testHost)
  .get('/')
  .reply(status, reply)

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

test('extracting json-ld schema from webpage', async () => {
  const scope = createScope(200, stubs.validHtml5)
  const result = await extract(`${testHost}/`)

  expect(result).toEqual({
    '@context': 'http://schema.org',
    '@type': 'Organization',
    'url': 'http://www.example.com',
    'name': 'Unlimited Ball Bearings Corp.',
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+1-401-555-1212',
      'contactType': 'Customer service'
    }
  })
})
