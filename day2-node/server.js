const http = require('http');

const server = http.createServer((req, res) => {
  res.end("Response from my server");
});

console.log("I'm listening");
server.listen(3000);
