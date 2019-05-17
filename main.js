var http = require('http');
var fs = require('fs');
var url = require('url');
 
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id === undefined ? 'Welcome' : queryData.id;
 
    if(pathname == '/'){
      fs.readdir('./data', function(err, filelist) {
        var hrefs = '<ul>';
        hrefs += filelist.map((filename, index) => `<li><a href="/?id=${filename}">${filename}</a></li>`).join('');
        hrefs += '</ul>';
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${hrefs}
            <h2>${title}</h2>
            <p>${title === 'Welcome' ? 'Hello, Node.js' : description}</p>
          </body>
          </html>
          `;
          response.writeHead(200);
          response.end(template);
        });
      })
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);