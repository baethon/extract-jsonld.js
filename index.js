const { JSDOM } = require('jsdom')
const Future = require('fluture')

// loadDom :: String -> Future e JSDOM
const loadDom = Future.encaseP(JSDOM.fromURL)

// findScript :: JSDOM -> Catchable e DOMElement
const findScript = dom => {
  const script = dom.window.document.querySelector('script[type="application/ld+json"]')

  if (!script) {
    throw new Error('Couldn\'t find script tag')
  }

  return script
}

// extract :: String -> Future e Object
const extract = url => loadDom(url)
  .chain(Future.encase(findScript))
  .map(domElement => domElement.innerHTML)
  .chain(Future.encase(JSON.parse))

module.exports = extract
