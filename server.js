var http = require('http');
var url  = require('url');
var path = require('path');
var fs   = require('fs');
var color = require('colors');

var port = 8080;

var mimeTypes = {
  'htm' : 'text/html',
  'html': 'text/html',
  'jpeg': 'image/jpeg',
  'jpg' : 'image/jpeg',
  'png' : 'image/png',
  'gif' : 'image/gif',
  'js'  : 'text/javascript',
  'css' : 'text/css'
};

function send404(res) {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.write('404 Not Found\n');
  res.end();
  return res;
}

var server = http.createServer(function(req, res) {
  var uri = url.parse(req.url).pathname;
  var filename = path.join(process.cwd(), uri);

  // only one route and the public assets
  if (uri != '/' && uri.indexOf('/public') === -1) {
    res = send404(res);
    return;
  }

  fs.exists(filename, function(exists) {
    if(!exists || filename.indexOf('src/') > -1) {
      res = send404(res);
      return;
    }


    if (fs.statSync(filename).isDirectory()) filename += '/index.html';
    // double check if the file exists
    fs.exists(filename, function(exists) {
      if(!exists) {
        res = send404(res);
        return;
      }

      fs.readFile(filename, 'binary', function(err, file) {
        if (err) {
          res.writeHead(500, {'Content-Type': 'text/plain'});
          res.write(err + '\n');
          res.end();
          return;
        }

        // finally render the file with the good mime type
        var mimeType = mimeTypes[path.extname(filename).split('.')[1]];
        res.writeHead(200, {'Content-Type': mimeType});
        res.write(file, 'binary');
        res.end();
      });
    });
  });
});

server.listen(port);
console.log('Server running at: %s.'.green, port);
console.log('Version: ' + process.version);
