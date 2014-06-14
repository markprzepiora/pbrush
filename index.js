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

function wrapEvent(socket, name, value) {
  var result = {};
  result['socket'] = socket;
  result[name]     = value;
  return result;
}

function socketEvent(name, key, socket) {
  return bacon.fromEventTarget(socket, name).map(wrapEvent, socket, key);
}

function broadcast(event, data) {
  var buffer = data.buffer,
      socket = data.socket;

  return socket.broadcast.emit(event, buffer);
}

var connections = bacon.fromEventTarget(io.sockets, 'connection');
var disconnects = connections.map(bacon.fromEventTarget, 'disconnect');
var buffers     = connections.flatMap(socketEvent, 'buffer-from-client', 'buffer');
var clear       = connections.flatMap(socketEvent, 'clear-from-client', 'clear');

buffers.assign(broadcast, 'buffer-from-server');
clear.assign(broadcast,   'clear-from-server');
