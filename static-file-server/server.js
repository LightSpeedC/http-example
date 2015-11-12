// server.js サーバ

(function () {
  'use strict';

  var PORT = Number(process.argv[2] || 8080);
  var http = require('http');
  var path = require('path');
  var fs = require('fs');
  var mimeTypes = require('./mime-types');
  var rootFolder = path.join(__dirname, 'public');

  function serveStatic(req, res) {
    var startTime = Date.now();
    console.log('(s)request: ' + req.method + ' ' + req.url);
    var buffs = [], bufflen = 0;
    req.on('readable', function () {
      var buff = req.read();
      if (buff) buffs.push(buff), bufflen += buff.length;
    });
    req.on('end', function () {
      if (bufflen)
        console.log('(s)request data: ' +
          Buffer.concat(buffs, bufflen).toString().trim());
      if (req.method !== 'GET') {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Error! (' + req.method + ' ' + req.url + ')\n');
        return;
      }
      var file = path.join(rootFolder, req.url);
      function statDefault(file, cb) {
        fs.stat(file, function (err, stats) {
          if (err) return resError(err);
          if (stats.isDirectory())
            return statDefault(path.join(file, 'index.html'), cb);
          if (stats.isFile()) return cb(null, stats, file);
          return resError(new Error('not file, not directory eh?'));
        });
      }
      statDefault(file, function (err, stats, file) {
        res.statusCode = 200;
        var ext = path.extname(file);
        if (ext && ext[0] === '.') ext = ext.slice(1);
        res.setHeader('Content-Type', mimeTypes[ext] || 'text/plain');
        console.log('(s)response %s %s %s %s', req.method, req.url, ext, mimeTypes[ext]);
        fs.createReadStream(file).pipe(res);
        //res.end('hello world! .' + ext + ' -> ' + mimeTypes[ext] + ' (' + req.method + ' ' + req.url + ')\n');
        return;
      });
      function resError(err) {
        var msg = (err + '').replace(rootFolder, '');
        console.log('(s)response %s %s ERROR! %s', req.method, req.url, msg);
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Error! ' + msg + '(' + req.method + ' ' + req.url + ')\n');
      }

    }); // res.on end
  } // serveStatic

  var server = http.createServer(function (req, res) {
    serveStatic(req, res);
  });

  server.listen(PORT, function () {
    console.log('(s)port %s server listening...', PORT);
  });
  console.log('(s)port %s server starting...', PORT);

  // exit if SIGHUP signalled or console screen is closed
  process.on('SIGHUP', function () {
    console.log('(s)server exiting...');
    setTimeout(process.exit, 300);
  });

/*
  // server exiting... after 30 sec
  setTimeout(function () {
    console.log('(s)server exiting... (timeout)');
    process.exit();
  }, 30000);
*/

})();
