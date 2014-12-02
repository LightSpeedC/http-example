(function () {
  'use strict';

  var PORT = Number(process.argv[2] || 8080);
  var http = require('http');

  var server = http.createServer(function (req, res) {
    console.log('(s)request: ' + req.method + ' ' + req.url);
    var buffs = [], bufflen = 0;
    req.on('readable', function () {
      var buff = req.read();
      if (buff) buffs.push(buff), bufflen += buff.length;
    });
    req.on('end', function () {
      if (bufflen)
        console.log('(s)request data: ' + Buffer.concat(buffs, bufflen).toString().trim());
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('hello world! (' + req.method + ' ' + req.url + ')\n');
    });
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

  // server exiting... after 2 sec
  setTimeout(function () {
    console.log('(s)server exiting... (timeout)');
    process.exit();
  }, 2000);

})();
