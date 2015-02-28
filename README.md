##Creates a TCP proxy that delays packets.

#Install
npm install -g tcpslow

##Usage

For example, to create a proxy listening on port 1522 to tcp port 1521, with 150 milliseconds of delay, you could run:
 
```tcpslow -l 1522 -f 1521 -d 150```


Delay is optional. If ommitted, data are send as fast as possible.

Unix domain sockets are also supported, use -L or -F with a path as the argument.

##Examples
Listent (-l) to port 1522 and forward (-f) to an Oracle database on port 1521. Delay (-d) data receiving by 150ms and display connection events (-v) and binary data (-p). 
```tcpslow.js -l 1522 -f 1521 -v -p -d 150```
