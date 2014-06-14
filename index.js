// var app              = require('express')(),
//     // io               = require('socket.io').listen(app),
//     coffeeMiddleware = require('coffee-middleware')({ src: __dirname + '/views' }),
//     serveStatic      = require('serve-static')(__dirname + 'views');

var express = require('express'),
    app     = express(),
    path    = require('path'),
    coffee  = require('coffee-middleware'),
    static  = require('serve-static');

app.use(static(__dirname + '/views'));
app.use(coffee({ src: __dirname + '/views' }));
app.listen(8080);

// // routing
// app.get('/', function (req, res) {
//   res.sendfile(__dirname + '/index.html');
// });
