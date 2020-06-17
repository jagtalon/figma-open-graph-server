const http = require('http');
const crawler = require("open-graph-scraper");

http.createServer((request, response) => {
  const { url } = request;
  let body = [];

  request.on('error', errorReporting)
    .on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      response.on('error', errorReporting);

      // Make sure to return a JSON response.
      response.statusCode = 200;
      response.setHeader('Content-Type', 'application/json');
      response.setHeader('Access-Control-Allow-Origin', '*');
  
      // Crawl the page and retrieve the Open Graph data.
      fetchOpenGraph(response, url.replace(/^\//, ''));
    });
}).listen(8080);

// Crawl the page and retrieve the Open Graph data.
function fetchOpenGraph(response, url) {
  const options = {
    'user-agent': 'Figma Open Graph Plugin Bot 1.0',
    url: url
  };

  crawler(options)
    .then((data) => {
        const { result } = data;
        response.end(JSON.stringify(result));
    }).catch((error) => {
        response.end(JSON.stringify(error));
    });
}

function errorReporting(err) {
  console.error(err);
}