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
    const scrapeResponse = await fetch('http://example.com/', requestInit)
    const scrapeResult = await gatherResponse(scrapeResponse)

    const root = HTMLParser.parse(scrapeResult)
    let metaTags = root.querySelectorAll('meta')

    return new Response(JSON.stringify({result: []}), responseInit)
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