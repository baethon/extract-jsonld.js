const Maybe = require('folktale/maybe')
const { JSDOM } = require('jsdom')

const extractJson = domElement => {
  const json = domElement.innerHTML

  try {
    return Maybe.Just(JSON.parse(json))
  } catch (e) {
    return Maybe.Nothing()
  }
}

const findScript = dom => Maybe.fromNullable(
  dom.window.document.querySelector('script[type="application/ld+json"]')
)

// String -> Promise (Maybe object)
const extract = async url => {
  const dom = await JSDOM.fromURL(url)
  return findScript(dom).chain(extractJson)
}

module.exports = extract
