const nock = require('nock')
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

describe('Future', () => {
  test('extracting json-ld schema from webpage', (done) => {
    createScope(200, stubs.validHtml5)

    extract(`${testHost}/`)
      .fork(
        () => done('Something went wrong'),
        result => {
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

          done()
        }
      )
  })

  test('reject when script tag is missing', (done) => {
    createScope(200, '<html><body></body></html>')

    extract(`${testHost}/`).fork(
      () => done(),
      () => done('Should not resolve')
    )
  })

  test('reject on JSON parse error', (done) => {
    createScope(200, stubs.invalidHtml5)

    extract(`${testHost}/`).fork(
      () => done(),
      () => done('Should not resolve')
    )
  })

  test('reject when unable to load jsdom', (done) => {
    createScope(404, 'Not found')

    extract(`${testHost}/`).fork(
      () => done(),
      () => done('Should not resolve')
    )
  })
})

describe('Promise', () => {
  test('resolve json-ld schema from webpage', async () => {
    createScope(200, stubs.validHtml5)

    const result = await extract(`${testHost}/`).promise()

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

  test('reject when script tag is missing', async () => {
    createScope(200, '<html><body></body></html>')

    await expect(extract(`${testHost}/`).promise())
      .rejects.toThrow()
  })

  test('reject on JSON parse error', async () => {
    createScope(200, stubs.invalidHtml5)

    await expect(extract(`${testHost}/`).promise())
      .rejects.toThrow()
  })

  test('reject when unable to load jsdom', async () => {
    createScope(404, 'Not found')

    await expect(extract(`${testHost}/`).promise())
      .rejects.toThrow()
  })
})
