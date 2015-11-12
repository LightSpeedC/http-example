(function () {
  'use strict';

  var PORT = Number(process.argv[2] || 8080);
  var http = require('http');
  var util = require('util');

  var options = {
    method: 'GET',
    hostname: 'localhost',
    port: PORT,
    path: '/',
  };

  console.log('(c)requesting...');

  function responseCallback(res) {
    console.log('(c)response stat: ' + res.statusCode +
        ' ' + http.STATUS_CODES[res.statusCode]);
    for (var i in res.headers)
      console.log('(c) res.head: %s: %s', i, res.headers[i]);
    if (res.rawHeaders) // if your node v0.11.*
      for (var i = 0, n = res.rawHeaders.length - 1; i < n; i += 2)
        console.log('(c) res.rawHead: %s: %s', res.rawHeaders[i], res.rawHeaders[i + 1]);
    //res.setEncoding('utf8');
    var buffs = [], bufflen = 0;
    res.on('readable', function () {
      var buff = res.read();
      if (buff) buffs.push(buff), bufflen += buff.length;
    });
    res.on('end', function () {
      console.log('(c)response data end.');
      //    Buffer.concat(buffs, bufflen).toString().trim());
    });
    res.on('error', function(err) {
      console.log('(c)response error: ' + err.message);
    });
  }

  // GET request after 400 msec
  setTimeout(function () {
    options.method = 'GET';
    console.log('(c)request: ' +
      options.method + ' ' + options.path + ' ' +
      options.hostname + ':' + options.port);
    var req = http.request(options, responseCallback);
    req.on('error', function(err) {
      console.log('(c)request error: ' + err.message);
    });
    req.end();
  }, 400);

  // POST request after 800 msec
  setTimeout(function () {
    options.method = 'POST';
    console.log('(c)request: ' +
      options.method + ' ' + options.path + ' ' +
      options.hostname + ':' + options.port);
    var req = http.request(options, responseCallback);
    req.on('error', function(err) {
      console.log('(c)request error: ' + err.message);
    });
    req.write('post data-1 ');
    req.write('post data-2\n');
    req.end();
  }, 800);

  // client exiting... after 2 sec
  setTimeout(function () {
    console.log('(c)client exiting... (timeout)');
    process.exit();
  }, 2000);

})();
