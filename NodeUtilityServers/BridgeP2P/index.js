"use strict";

var server = require('http').createServer();
var io = require('socket.io')(server);
var p2p = require('socket.io-p2p-server').Server;

io.use(p2p);

io.on('connection', (socket) => {
  console.log("Something connected");

  // signalling
  socket.on('activate', (data) => { socket.broadcast.emit('activate', data); });
  socket.on('deactivate', (data) => { socket.broadcast.emit('deactivate', data); });
});


server.listen(3030);