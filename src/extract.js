const { JSDOM } = require('jsdom')

const parseScript = domElement => {
  const json = domElement.innerHTML

  return JSON.parse(json)
}

module.exports = async (url) => {
  const dom = await JSDOM.fromURL(url)
  const script = dom.window.document.querySelector('script[type="application/ld+json"]')

  return script
    ? parseScript(script)
    : null
}
