const fs = require('fs')

const readSync = file => {
  const buffer = fs.readFileSync(file)

  return buffer.toString()
}

module.exports = {
  validHtml5: readSync(`${__dirname}/valid-html5.html`),
  invalidHtml5: readSync(`${__dirname}/invalid-html5.html`)
}
