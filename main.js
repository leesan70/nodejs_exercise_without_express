var http = require('http');
var fs = require('fs');
var url = require('url');

function HTMLtemplate(title, list, body){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${body}
  </body>
  </html>
  `;
}

function links(filelist) {
  var hrefs = '<ul>';
  hrefs += filelist.map(
    (filename, index) => `<li><a href="/?id=${filename}">${filename}</a></li>`
  ).join('');
  hrefs += '</ul>';
  return hrefs;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id === undefined ? 'Welcome' : queryData.id;
 
    if(pathname == '/'){
      fs.readdir('./data', function(err, filelist) {
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var template = HTMLtemplate(
            title,
            links(filelist),
            `<p>${title === 'Welcome' ? 'Hello, Node.js' : description}</p>`
          );
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