const http = require('http');
const openGraphScraper = require("open-graph-scraper");

http.createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();

      response.on('error', (err) => {
        console.error(err);
      });
  
      // Make sure to return a JSON response.
      response.statusCode = 200;
      response.setHeader('Content-Type', 'application/json');
  
      // Remove the slash from the URL.
      let cleanUrl = url.replace(/^\//, '');
      
      const options = {
        'user-agent': 'Figma Open Graph Plugin Bot 1.0',
        url: cleanUrl
      };
      
      // Scrape the page and retrieve the Open Graph data.
      openGraphScraper(options)
        .then((data) => {
            const { result } = data;
            response.end(JSON.stringify(result));
        }).catch((error) => {
            response.end(JSON.stringify(error));
        });
    });
  }).listen(8080);