var express = require('express'),
    app     = express(),
    path    = require('path'),
    coffee  = require('coffee-middleware'),
    static  = require('serve-static'),
    server  = require('http').Server(app),
    io      = require('socket.io')(server);

app.use(static(__dirname + '/views'));
app.use(coffee({ src: __dirname + '/views' }));

app.listen(8080);

app.get('/foo', function (req, res) {
  res.send('hello world');
});

// io.on('connection', function (socket) {
// });
