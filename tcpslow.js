#!/usr/bin/env node
'use strict';

var program = require('commander');
var packagejson = require('./package.json');

program
.version(packagejson.version)
.description('Delay packets')
.option('-l, --listen [port]', 'TCP port to listen on', parseInt)
.option('-L, --listenuds [filename]', 'Unix domain socket to listen on')
.option('-f, --forward [port]', 'TCP port to forward to', parseInt)
.option('-F, --forwarduds [filename]', 'Unix domain socket to forward to')
.option('-d, --delay [ms]', 'Optional milliseconds to delay', parseInt)
.option('-h, --host [hostname]', 'Hostname of remote. Cannot be used with -F')
.option('-v, --verbose', 'Log connection events')
.option('-p, --packet', 'Log data transmitted')
.option('-s, --sending', 'Delay packet sending in addition to receiving', false)
.parse(process.argv);

if (program.listen && program.listenuds) {
  console.error('Can\'t listen on a TCP and a Unix domain socket');
  program.help();
}

if (program.forward && program.forwarduds) {
  console.error('Can\'t forward to a TCP port and a Unix domain socket');
  program.help();
}

if (program.host && program.forwarduds) {
  console.error('Can\'t use a hostname with a forwarding Unix domain socket');
  program.help();
}

if (!(program.listen || program.listenuds)) {
  console.error('Need a listening port');
  program.help();
}

if (!(program.forward || program.forwarduds)) {
  console.error('Need a forwarding port');
  program.help();
}

// normalize path strings
if (program.forwarduds) {
  program.forwarduds = path.normalize(program.forwarduds);
}

if (program.listenuds) {
  program.listenuds = path.normalize(program.listenuds);
}

var net = require('net');
var chalk = require('chalk');
var path = require('path');

function createConnection() {
  var conn;

  if (program.host || program.forward) {
    conn = {};
    conn.port = program.forward;
    if (program.host) {
      conn.host = program.host;
    } else {
      conn.host = 'localhost';
    }
    return net.createConnection(conn);
  } else {
    return net.createConnection(path.normalize(program.forwarduds));
  }
}

var server = net.createServer(function(listen) {
  if (program.verbose) console.log(new Date() + ' (listening) client connected ');

  listen.forward = createConnection();
  listen.forward.on('connect', function() {
    if (program.verbose) console.log(new Date() + ' (forwarding) client connected.');
  });
  listen.forward.on('data', function(data) {
    if (program.packet) console.log(chalk.red(data))
      setTimeout(function() {
        listen.write(data);
      }, program.delay);
  });
  listen.forward.on('error', function(err) {
    if (program.verbose) console.log(new Date() + ' (forwarding) error ' + err);
    listen.destroy();
  });
  listen.forward.on('end', function() {
    if (program.verbose) console.log(new Date() + ' (forwarding) client end.');
    listen.end();
  });
  listen.forward.on('close', function() {
    if (program.verbose) console.log(new Date() + ' (forwarding) client close.');
    listen.end();
  })

  listen.on('data', function(data) {
    if (program.sending) {
      setTimeout(function() {
        listen.forward.write(data);
      }, program.delay);
    } else {
      listen.forward.write(data);
    }
    if (program.packet) console.log(chalk.blue(data));
  });
  listen.on('end', function() {
    if (program.verbose) console.log(new Date() + ' (listening) socket end.');
    listen.forward.end();
    listen.end();
  });
  listen.on('error', function(err) {
    if (program.verbose) console.log(new Date() + ' (listening) error: ' + err);
    listen.forward.destroy();
  });
  listen.on('close', function() {
    var args = Array.prototype.slice.call(arguments);
    if (program.verbose) console.log(new Date() + ' (listening) close: ' + args);
    listen.forward.end();
  });
});

server.listen(program.listen ? program.listen : program.listenuds, function() {
  console.log('tcpslow ' + packagejson.version);
  if (program.listen) {
    console.log('Listening on port ' + program.listen);
  } else {
    console.log('Listening on unix domain socket ' + program.listenuds);
  }
  console.log('Relaying to ' + (program.host ? program.host + ' ' : '') 
    + 'port ' + program.forward);
  if (program.delay) {
    console.log(' delaying by ' + program.delay + 'ms' + (program.sending ? ' in both directions ' : ' on receive'));
  }
});
