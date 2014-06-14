var express = require('express'),
    app     = express(),
    path    = require('path'),
    coffee  = require('coffee-middleware'),
    static  = require('serve-static'),
    server  = require('http').Server(app),
    io      = require('socket.io')(server);

app.use(static(__dirname + '/views'));
app.use(coffee({ src: __dirname + '/views' }));

server.listen(8080);

io.on('connection', function (socket) {
  io.emit('welcome', 'Hi there!!!');
});
