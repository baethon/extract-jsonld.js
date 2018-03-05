# extract-jsonld.js
Simple utility for extracting JSON-LD data from given URL

# Usage

```js
// extract :: String -> Promise (Maybe Object)
const extract = require('@baethon/extract-jsonld')

const result = await extract('http://some.site/with-embeded-jsonld')

result.map(jsonld => {
  // Do something
})
```

# How it works

Script tries to fetch contents of given URL. Using [jsdom](https://github.com/jsdom/jsdom) it will try to find `<script type="application/ld+json">` tag and parse its contents.

The result will be wrapped in [Maybe](https://github.com/jsdom/jsdom) object.

If `jsdom` fails to load URL promise will be rejected.
