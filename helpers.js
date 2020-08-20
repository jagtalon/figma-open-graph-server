const HTMLParser = require('node-html-parser')

// Read either JSON, ArrayBuffer, or text to completion.
// This is adapted from Cloudflare's example:
// https://developers.cloudflare.com/workers/templates/pages/fetch_html/
async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return {
      type: 'text',
      result: JSON.stringify(await response.json()),
    }
  } else if (contentType.includes('image')) {
    let arrayBuffer = await response.arrayBuffer()

    return {
      type: contentType,
      result: imageToBase64(arrayBuffer),
    }
  } else {
    return {
      type: 'text',
      result: await response.text(),
    }
  }
}

// Parse the HTML and return the `<meta>` tags that we need.
function scrapeMetaTags(text) {
  const root = HTMLParser.parse(text)
  let metaTags = root.querySelectorAll('meta')

  // Create an object with the attributes that we want.
  metaTags = metaTags.reduce((result, item) => {
    let prop = item.getAttribute('property')
    let content = item.getAttribute('content')

    if (typeof prop !== 'undefined' && typeof content !== 'undefined') {
      result[prop] = content
    }

    return result
  }, {})

  return metaTags
}

// Get URL through the `url` parameter.
// This is from web.scraper.workers.dev example:
// https://github.com/adamschwartz/web.scraper.workers.dev/blob/995e0fd351bf349955724d403658be9a40c0bf18/index.js#L28
function getUrlParam(request) {
  const searchParams = new URL(request.url).searchParams
  let url = searchParams.get('url')
  if (url && !url.match(/^[a-zA-Z]+:\/\//)) url = 'http://' + url

  return url
}

// Convert image binary to base64-encoded string.
// This is from StackOverflow:
// https://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string
function imageToBase64(arrayBuffer) {
  return btoa(
    new Uint8Array(arrayBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      '',
    ),
  )
}

export { getUrlParam, scrapeMetaTags, gatherResponse }
