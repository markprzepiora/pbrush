var express = require('express'),
    app     = express(),
    path    = require('path'),
    coffee  = require('coffee-middleware'),
    static  = require('serve-static'),
    server  = require('http').Server(app),
    io      = require('socket.io')(server),
    bacon   = require('baconjs').Bacon,
    uuid    = require('node-uuid');

app.use(static(__dirname + '/views'));
app.use(coffee({ src: __dirname + '/views' }));

server.listen(8080);

var usernames = {};

function addUser(username) {
  usernames[username] = username;
}

function removeUser(username) {
  delete usernames[username];
}

var connections = bacon.fromEventTarget(io.sockets, 'connection');
var disconnects = connections.map(bacon.fromEventTarget, 'disconnect');

connections.onValue(function(socket) {
  console.log('hihi');
});

disconnects.onValue(function(socket) {
  console.log('byebye');
});

// disconnects.onValue(function(socket) {
//   console.log('sorry to see you go :(');
// });

// io.on('connection', function (socket) {
//   socket.username = uuid.v4();
//   addUser(socket.username);
//   io.emit('welcome', 'Hi there ' + socket.username + '!!!');
// });
