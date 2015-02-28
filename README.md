##Creates a TCP proxy that delays packets.

#Install
npm install -g tcpslow

#Usage

For example, to create a proxy listening on port 1522 to tcp port 1521, with 150 milliseconds of delay, you could run:
 
```tcpslow -l 1522 -f 1521 -d 150```


