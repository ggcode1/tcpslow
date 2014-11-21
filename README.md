##Creates a TCP proxy that delays packets.


For example, to create a proxy to Oracle with 150 milliseconds of delay, you could run:

```node tcpslow.js -l5104 -f1521 -d150```

Remember point your Oracle client to port 5104.

###Optional arguments

Listen port ```-l5104```

Forward to ```-f1521```

Milliseconds of delay to introduce ```-d300```

Hostname to forward to ```--r=10.3.2.1```

Verbose ``` -v ```

Console log the buffers:``` --vv ```

Delay packet sending as well as receiving: ``` -b ```
