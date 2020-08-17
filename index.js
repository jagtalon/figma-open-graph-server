const HTMLParser = require('node-html-parser');

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Headers used to respond to the Figma plugin.
  const responseInit = {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
     },
  }

  // Headers used to scrape a website.
  const requestInit = {
    headers: {
      'User-Agent': 'Figma Open Graph Plugin 1.0',
      'Accept': 'text/html;charset=UTF-8'
    }
  }

  try {
    const scrapeResponse = await fetch('https://www.nytimes.com/wirecutter/', requestInit)
    const scrapeResult = await gatherResponse(scrapeResponse)

    const root = HTMLParser.parse(scrapeResult)

    // Get <meta> tags with `property` attributes.
    let metaTags = root.querySelectorAll('meta')
    let filteredMetaTags = metaTags.filter(e => {

      // Make sure that both `propery` and `content` attributes are set.
      let prop = e.getAttribute('property')
      let content = e.getAttribute('content')

      if (typeof prop !== 'undefined' && typeof content !== 'undefined') {
        return true
      } else {
        return false
      }
    })

    // Only get the attributes that we want.
    metaTags = filteredMetaTags.map(e => {
      return { prop: e.getAttribute('property'), content: e.getAttribute('content')}
    })

    console.log(metaTags)

    return new Response(JSON.stringify({result: metaTags}), responseInit)
  } catch (err) {
    return new Response(JSON.stringify({error: err.stack}), responseInit)
  }
}

// This is from Cloudflare's example:
// https://developers.cloudflare.com/workers/templates/pages/fetch_html/
async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return JSON.stringify(await response.json())
  } else if (contentType.includes('application/text')) {
    return await response.text()
  } else if (contentType.includes('text/html')) {
    return await response.text()
  } else {
    return await response.text()
  }
}