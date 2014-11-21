var net = require('net');
var chalk = require('chalk');

var argv = require('minimist')(process.argv.slice(2));

var listenPort = argv.l || 5104;
var forward = argv.f || 1521;
var delay = argv.d || 150;
var remotehost = argv.r;
var bothways = argv.b;
var log = argv.v;
var verbose = argv.vv;

var conn = {};
conn.port = forward;
if (remotehost)
  conn.host = remotehost;

var server = net.createServer(function(listen) {
  var forward;

  forward = net.createConnection(conn);
  forward.on('connect', function() {
    if (log) console.log(new Date() + ' Client connected.');
  });
  forward.on('data', function(data) {
    if (verbose) console.log(chalk.red(data))
    setTimeout(function() {
      listen.write(data);
    }, delay);
  });
  forward.on('error', function(err) {
    console.error(err);
  });
  forward.on('end', function() {
    if (log) console.log(new Date() + ' Client disconnected.');
  });

  listen.on('data', function(data) {
    if (bothways) {
      setTimeout(function() {
        forward.write(data);
      }, delay);
    } else {
      forward.write(data);
    }
    if (verbose) console.log(chalk.blue(data));
  });
  listen.on('end', function() {
    if (log) console.log(new Date() + ' Socket end.');
    forward.end();
    listen.end();
  });
  listen.on('error', function(err) {
    if (log) console.log(new Date() + ' ' + err);
  });

});

server.listen(listenPort, function() {
  console.log('tcpslow listening on port ' + listenPort + ' relaying to' +
    (remotehost ? +' ' + remotehost : '') + ' port ' + forward +
    ' delaying by ' +
    delay +
    'ms' + (bothways ? ' in both directions ' : ' on receive'));
});
