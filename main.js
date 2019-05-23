const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const templates = require('./lib/templates.js');
const sanitizeHtml = require('sanitize-html');

const app = http.createServer(function(request,response){
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;
 
    if(pathname === '/'){
      fs.readdir('./data', function(err, filelist) {
        const sanitizedId = sanitizeHtml(queryData.id === undefined ? 'Welcome' : queryData.id);
        const crud = '<a href="/create">create</a>'.concat(
          queryData.id === undefined ? '' :
            ` <a href="update?id=${sanitizedId}">update</a>
            <form action="/delete" method="post">
              <input type="hidden" name="id" value="${sanitizedId}">
              <input type="submit" value="delete">
            </form>
            `);
        const list = templates.links(filelist, crud);
        fs.readFile(`data/${sanitizedId}`, 'utf8', function(err, description){
          const sanitizedDescription = sanitizeHtml(description);
          const template = templates.HTML(
            sanitizedId,
            list,
            `<p>${sanitizedId === 'Welcome' ? 'Hello, Node.js' : sanitizedDescription}</p>`
          );
          response.writeHead(200);
          response.end(template);
        });
      })
    } else if(pathname === '/create'){
      fs.readdir('./data', function(err, filelist){
        const title = 'WEB - create';
        const list = templates.links(filelist, '');
        const template = templates.HTML(title, list, `
          <form action="/process_create" method="post">
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
        let body = '';
        request.on('data', (data) => {
          body += data;
        })
        request.on('end', () => {
          const post = qs.parse(body);
          const sanitizedId = sanitizeHtml(post.title);
          const sanitizedDescription = sanitizeHtml(post.description);
          fs.writeFile(`data/${sanitizedId}`, sanitizedDescription, 'utf8', (err) => {
            response.writeHead(302, {
              'Location' : `/?id=${sanitizedId}`
            });
            response.end();
          });
        })
      }
    } else if(pathname === '/update') {
      fs.readdir('./data', function(err, filelist){
        const title = 'WEB - create';
        const sanitizedId = sanitizeHtml(queryData.id);
        const crud = '<a href="/create">create</a>'.concat(
          queryData.id === undefined ? '' :
            ` <a href="update?id=${sanitizedId}">update</a>
            <form action="/delete" method="post">
              <input type="hidden" name="id" value="${sanitizedId}">
              <input type="submit" value="delete">
            </form>
            `);
        const list = templates.links(filelist, crud);
        fs.readFile(`data/${sanitizedId}`, 'utf8', function(err, description){
          const sanitizedDescription = sanitizedDescription(description);
          const template = templates.HTML(title, list, `
          <form action="/process_update" method="post">
            <input type="hidden" name="id" value="${sanitizedId}">
            <p><input type="text" name="title" value="${sanitizedId}"></p>
            <p>
              <textarea name="description" placeholder="description">${sanitizedDescription}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `);
        response.writeHead(200);
        response.end(template);
        });
      });
    } else if(pathname === '/process_update') {
      if (request.method == 'POST') {
        let body = '';
        request.on('data', (data) => {
          body += data;
        })
        request.on('end', () => {
          const post = qs.parse(body);
          const sanitizedId = sanitizeHtml(post.id);
          const sanitizedTitle = sanitizeHtml(post.title);
          const sanitizedDescription = sanitizeHtml(post.description);
          fs.unlink(`data/${sanitizedId}`, (err) => {
            fs.writeFile(`data/${sanitizedTitle}`, sanitizedDescription, 'utf8', (err) => {
              response.writeHead(302, {
                'Location' : `/?id=${sanitizedTitle}`
              });
              response.end();
            });
          });
        })
      }
    } else if(pathname === '/delete') {
      if (request.method == 'POST') {
        let body = '';
        request.on('data', (data) => {
          body += data;
        });
        request.on('end', () => {
          const post = qs.parse(body);
          const sanitizedId = sanitizeHtml(post.id);
          fs.unlink(`data/${sanitizedId}`, (err) => {
            response.writeHead(302, {
              'Location' : `/`
            });
            response.end();
          });
        });
      }
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);