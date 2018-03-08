# extract-jsonld.js
Simple utility for extracting JSON-LD data from given URL

# Usage

```js
// extract :: String -> Future e Object
const extract = require('@baethon/extract-jsonld')

// start extraction
extract('http://some.site/with-embeded-jsonld').fork(
  console.warn,
  jsonld => {}
)

// or convert Future to promise
const jsonld = await extract('http://some.site/with-embeded-jsonld').promise()

```

# How it works

The idea is simple: load [JSDOM](https://github.com/jsdom/jsdom) document find the right script and `JSON.parse` its contents.

Whole thing is wrapped inside [Future](https://github.com/fluture-js/Fluture) monad. So the process will start after calling `fork()` or `promise()` methods.

Script will fail when:

* fails to load JSDOM
* fails to find script tag
* fails to parse contents of the script