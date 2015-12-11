
"use strict";
var SegfaultHandler = require('segfault-handler');
SegfaultHandler.registerHandler();

var Express = require('express');
var HTTP = require('http');

var SocketClient = require('socket.io-client');
var SocketP2P = require('socket.io-p2p');
var WebRTC = require('wrtc');

var app = Express();
var http = HTTP.Server(app);

const SIZE = [10, 10];
const HOST_SERVER = 'http://localhost:3030/';

let options = {
  peerOpts: {
    //trickle: false,
    wrtc: WebRTC
  },
  autoUpgrade: false // true
};
var socketReady = false;
//var socket = new SocketP2P(SocketClient(HOST_SERVER), options);
var socket = SocketClient(HOST_SERVER);
socket.on('ready', () => {
  console.log("Socket: ready");
  socketReady = true;
});
socket.on('upgrade', () => {
  console.log("Socket: upgrade");
});
socket.on('connect', () => {
  console.log("Socket: connect");
});

const ACTIONS = ["activate", "deactivate"];

app.post('/:action/:room/:x/:y', (request, result) => {
  "use strict";

  //if (!socketReady) {
  //  return result.status(500).send("Socket not ready");
  //}

  if (!request.params) {
    return result.status(400).send("No parameters passed");
  }

  if (ACTIONS.indexOf(request.params.action) === -1) {
    return result.status(404).send("No such action: " + request.params.action);
  }

  let room = parseInt(request.params.room);
  if (Number.isNaN(room)) {
    result.status(400).send("Not a valid room: " + room);
  }

  let x = parseInt(request.params.x);
  if (Number.isNaN(x)) {
    result.status(400).send("Not a valid column (x): " + x);
  }

  let y = parseInt(request.params.y);
  if (Number.isNaN(room)) {
    result.status(400).send("Not a valid row (y): " + y);
  }

  socket.emit(request.params.action, { room, x, y });

  return result.sendStatus(200);
});

http.listen(3040);