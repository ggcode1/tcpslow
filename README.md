# [tcpslow](https://www.npmjs.com/package/tcpslow)

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![Node.js Version][node-image]][node-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][dependencies-image]][dependencies-url]
[![Coverage Status][coveralls-image]][coveralls-url]

[![NPM][npm-image]][npm-url]

## Creates a TCP or unix domain socket proxy that (optionally) delays packets.

# Install
npm install -g tcpslow

## Usage

For example, to create a proxy listening on TCP port 1522, forwarding to TCP port 1521, with 150 milliseconds of delay, you could run:
 
```tcpslow -l 1522 -f 1521 -d 150```


Delay is optional. If ommitted, data are sent as fast as possible.

Unix domain sockets are also supported, use -L or -F with a path as the argument. Unix domain sockets are sockets that are represented as files in the file system. They allow for exchanging data between processes executing within the same host operating system (e.g., not over a network).

## Examples
```tcpslow -l 9002 -f 9000```

Listen on TCP port 9002 and forward to TCP port 9000.

```tcpslow -l 1522 -f 1521 -v -p -d 150```

Listen (-l) to TCP port 1522 and forward (-f) to an Oracle database on TCP port 1521. Delay (-d) data receiving by 150ms and display connection events (-v) and binary data (-p). 

```tcpslow -L foo -f 9000```

Listen on unix domain socket and forward to TCP port 9000

```tcpslow -L foo -F bar```

Listen on unix domain socket foo and forward to unix domain socket bar.

[npm-version-image]: https://img.shields.io/npm/v/tcpslow.svg
[npm-downloads-image]: https://img.shields.io/npm/dm/tcpslow.svg
[npm-image]: https://nodei.co/npm/tcpslow.png?downloads=true&downloadRank=true&stars=true
[npm-url]: https://npmjs.org/package/tcpslow
[travis-image]: https://img.shields.io/travis/llambda/tcpslow/master.svg
[travis-url]: https://travis-ci.org/llambda/tcpslow
[dependencies-image]: https://david-dm.org/llambda/tcpslow.svg?style=flat
[dependencies-url]: https://david-dm.org/llambda/tcpslow
[coveralls-image]: https://img.shields.io/coveralls/llambda/tcpslow/master.svg
[coveralls-url]: https://coveralls.io/r/llambda/tcpslow?branch=master
[node-image]: https://img.shields.io/node/v/tcpslow.svg
[node-url]: http://nodejs.org/download/
[gitter-join-chat-image]: https://badges.gitter.im/Join%20Chat.svg
[gitter-channel-url]: https://gitter.im/llambda/tcpslow
[express-session-url]: https://github.com/expressjs/session
[io-url]: https://iojs.org
