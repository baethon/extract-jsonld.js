const Maybe = require('folktale/maybe')
const Future = require('folktale/concurrency/future')
const { JSDOM } = require('jsdom')

//+ loadDom :: String -> Future Error JSDOM
const loadDom = url => Future.fromPromise(JSDOM.fromURL(url))

//+ maybeToFuture :: String -> Maybe a -> Future String a
const maybeToFuture = error => m => m.matchWith({
  Just: ({ value }) => Future.of(value),
  Nothing: () => Future.rejected(error)
})

//+ extractJson :: DOMElement -> Maybe Object
const extractJson = domElement => {
  const json = domElement.innerHTML

  try {
    return Maybe.Just(JSON.parse(json))
  } catch (e) {
    return Maybe.Nothing()
  }
}

//+ findScript :: JSOM -> Maybe DOMElement
const findScript = dom => Maybe.fromNullable(
  dom.window.document.querySelector('script[type="application/ld+json"]')
)

//* extract :: String -> Future Error Object
const extract = url => loadDom(url)
  .map(findScript)
  .chain(maybeToFuture('Couldn\'t find script tag'))
  .map(extractJson)
  .chain(maybeToFuture('Couldn\'t parse JSON'))

module.exports = extract
