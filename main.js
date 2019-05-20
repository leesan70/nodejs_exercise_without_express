var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function HTMLtemplate(title, list, body){
  return `
  <!doctype html>
  <html>
  <head>
    <title>${title}</title>
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
  hrefs += '<a href="/create">create</a>';
  hrefs += '</ul>';
  return hrefs;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
 
    if(pathname === '/'){
      fs.readdir('./data', function(err, filelist) {
        var title = queryData.id === undefined ? 'Welcome' : queryData.id;
        var list = links(filelist);
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var template = HTMLtemplate(
            title,
            list,
            `<p>${title === 'Welcome' ? 'Hello, Node.js' : description}</p>`
          );
          response.writeHead(200);
          response.end(template);
        });
      })
    } else if(pathname === '/create'){
      fs.readdir('./data', function(err, filelist){
        var title = 'WEB - create';
        var list = links(filelist);
        var template = HTMLtemplate(title, list, `
          <form action="http://localhost:3000/process_create" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `);
        response.writeHead(200);
        response.end(template);
      });
    } else if(pathname === '/process_create') {
      if (request.method == 'POST') {
        var body = '';
        request.on('data', (data) => {
          body += data;
        })
        request.on('end', () => {
          var post = qs.parse(body);
          response.setHeader('Content-Type', 'application/json');
          response.end(JSON.stringify(post));
        })
      }
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);