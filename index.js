addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const responseHeaders = {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
     },
  }

  const requestHeaders = {
    'User-Agent': 'Figma Open Graph Plugin 1.0'
  }

  const scrapeResponse = await fetch('http://example.com/', {})
  const scrapeResult = await gatherResponse(scrapeResponse)

  return new Response(JSON.stringify({result: scrapeResult, response: scrapeResponse}), responseHeaders)
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