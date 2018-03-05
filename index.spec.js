const nock = require('nock')
const Maybe = require('folktale/maybe')
const extract = require('./index')
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
  createScope(200, stubs.validHtml5)

  const result = await extract(`${testHost}/`)

  expect(Maybe.hasInstance(result)).toBeTruthy()
  expect(result).toEqual(Maybe.Just({
    '@context': 'http://schema.org',
    '@type': 'Organization',
    'url': 'http://www.example.com',
    'name': 'Unlimited Ball Bearings Corp.',
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+1-401-555-1212',
      'contactType': 'Customer service'
    }
  }))
})

test('return Nothing when script tag is missing', async () => {
  createScope(200, '<html><body></body></html>')

  const result = await extract(`${testHost}/`)

  expect(Maybe.Nothing.hasInstance(result)).toBeTruthy()
})

test('return Nothing on JSON parse error', async () => {
  createScope(200, stubs.invalidHtml5)

  const result = await extract(`${testHost}/`)

  expect(Maybe.Nothing.hasInstance(result)).toBeTruthy()
})

test('reject when unable to load jsdom', async () => {
  createScope(404, 'Not found')
  await expect(extract(`${testHost}/`)).rejects.toThrow()
})
