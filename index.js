import { getUrlParam, scrapeMetaTags, gatherResponse } from './helpers.js'

// Headers used to respond to the Figma plugin.
const responseInit = {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
}

// Headers used to scrape a website.
const requestInit = {
  headers: {
    'User-Agent': 'Figma Open Graph Plugin 1.0',
  },
}

// This is the main function that will handle all the requests to this worker.
async function handleRequest(request) {
  // Get the URL from the `url` param.
  let url = getUrlParam(request)

  try {
    const scrapeResponse = await fetch(url, requestInit)
    const scrapeResult = await gatherResponse(scrapeResponse)

    // If it's HTML, get <meta> tags with `property` attributes.
    // <meta property="..." content="...">
    if (scrapeResult.type === 'text') {
      let metaTags = scrapeMetaTags(scrapeResult.result)
      return new Response(JSON.stringify({ result: metaTags }), responseInit)

      // If it's an image, convert the binary to a base64-encoded string.
    } else {
      return new Response(
        JSON.stringify({
          result: `data:${scrapeResult.type};base64,${scrapeResult.result}`,
          type: scrapeResult.type,
        }),
        responseInit,
      )
    }
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch URL', message: err.stack }),
      responseInit,
    )
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
