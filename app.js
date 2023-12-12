const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  
  if(url === '/') {
    res.setHeader('Content-Type', 'text/html');
    fs.readFile('messages.txt', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        data = '';
      }
      res.write('<html>');
      res.write('<head><title>Enter message</title></head>');
      res.write('<body>');
      res.write('<h1>Messages</h1>');
      res.write('<ul>');
      const messages = data.split('\n').filter(Boolean);
      messages.forEach(message => {
        res.write(`<li>${message}</li>`);
      });
      res.write('</ul>');
      res.write('<form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form>');
      res.write('</body>');
      res.write('</html>');
      res.end();
    });
  } else if(url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    });
    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      fs.appendFile('messages.txt', message + '\n', (err) => {
        if (err) {
          console.error(err);
          res.statusCode = 500;
          return res.end('Error saving message');
        }
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  } else {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Page Not Found</title></head>');
    res.write('<body><h1>404 - Page Not Found</h1></body>');
    res.write('</html>');
    res.end();
  }
});

server.listen(3000);