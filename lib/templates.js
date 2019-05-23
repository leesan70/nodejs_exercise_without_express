const templates = {
  HTML: (title, list, body) => {
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
  }, 
  links: (filelist, crud) => {
    var hrefs = '<ul>';
    hrefs += filelist.map(
      (filename, index) => `<li><a href="/?id=${filename}">${filename}</a></li>`
    ).join('');
    hrefs += crud;
    hrefs += '</ul>';
    return hrefs;
  }
};

module.exports = templates;