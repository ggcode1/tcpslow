#!/usr/bin/env node

var program = require('commander');
var package = require('./package.json');

program
.version(package.version)
.description('Delay packets')
.option('-l, --listen [port]', 'TCP port to listen on', parseInt)
.option('-f, --forward [port]', 'TCP port to forward to', parseInt)
.option('-L, --listenuds [filename]', 'Unix domain socket to listen to')
.option('-F, --forwarduds [filename]', 'Unix domain socket to forward to')
.option('-d, --delay [ms]', 'Milliseconds to delay', parseInt)
.option('-h, --host [hostname]', 'Hostname of remote')
.option('-v, --verbose', 'Log connection events')
.option('-p, --packet', 'Log data transmitted')
.option('-s, --sending', 'delay packet sending in addition to receiving', false)
.parse(process.argv);

// if (!(program.listen || program.listenuds)) {
//   program.help();
// }

// if (!(program.forward || program.forwarduds)) {
//   program.help();
// }

var net = require('net');
var chalk = require('chalk');


var conn = {};
conn.port = program.forward;
if (program.host)
  conn.host = program.host;

var server = net.createServer(function(listen) {
  var forward;

  forward = net.createConnection(conn);
  forward.on('connect', function() {
    if (program.verbose) console.log(new Date() + ' Client connected.');
  });
  forward.on('data', function(data) {
    if (program.packet) console.log(chalk.red(data))
    setTimeout(function() {
      listen.write(data);
    }, program.delay);
  });
  forward.on('error', function(err) {
    console.error(err);
  });
  forward.on('end', function() {
    if (program.verbose) console.log(new Date() + ' Client disconnected.');
  });

  listen.on('data', function(data) {
    if (program.sending) {
      setTimeout(function() {
        forward.write(data);
      }, program.delay);
    } else {
      forward.write(data);
    }
    if (program.packet) console.log(chalk.blue(data));
  });
  listen.on('end', function() {
    if (log) console.log(new Date() + ' Socket end.');
    forward.end();
    listen.end();
  });
  listen.on('error', function(err) {
    if (program.verbose) console.log(new Date() + ' ' + err);
  });

});

server.listen(program.listen, function() {
  console.log('tcpslow listening on port ' + program.listen + ' relaying to' +
    (program.host ? +' ' + program.host : '') + ' port ' + program.forward +
    ' delaying by ' +
    program.delay +
    'ms' + (program.sending ? ' in both directions ' : ' on receive'));
});
