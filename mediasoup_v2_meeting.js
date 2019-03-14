//
// mediasoup_sample_v2
//   https://github.com/mganeko/mediasoup_sample_v2
//   mediasoup_sample_v2 is provided under MIT license
//
//   This sample is using https://github.com/versatica/mediasoup
//

// install
//   npm install ws
//   npm install socket.io
//   npm install express
//   npm install mediasoup
// or
//   npm install


'use strict';

// --- read options ---
const fs = require('fs');
let serverOptions = null;
let clientConfig = '';
if (isFileExist('options.js')) {
  //serverOptions = require('./options').serverOptions;
  const options = require('./options');
  serverOptions = options.serverOptions;
  clientConfig = options.clientConfig;
  console.log('read options.js');
}
else if (isFileExist('options_default.js')) {
  //serverOptions = require('./options_default').serverOptions;
  const options = require('./options_default');
  serverOptions = options.serverOptions;
  clientConfig = options.clientConfig;
  console.log('read options_defalult.js');
}
else {
  console.error('NO options. Please set options.js or options_defalult.js');
  process.exit(1);
}

let sslOptions = {};
if (serverOptions.useHttps) {
  sslOptions.key = fs.readFileSync(serverOptions.httpsKeyFile).toString(),
    sslOptions.cert = fs.readFileSync(serverOptions.httpsCertFile).toString()
}

// --- prepare server ---
const http = require("http");
const https = require("https");
//const WebSocketServer = require('ws').Server;
const express = require('express');

const app = express();
const webPort = serverOptions.listenPort;
app.use(express.static('public_meeting'));
/*
app.get('/client_config.js', function (req, res, next) {
  //const client_config = { flag: 'abc' };
  //res.json(client_config);
  res.send(clientConfig);
});
*/


let webServer = null;
//let redirectServer = null;
if (serverOptions.useHttps) {
  // -- https ---
  webServer = https.createServer(sslOptions, app).listen(webPort, function () {
    console.log('Web server start. https://' + serverOptions.hostName + ':' + webServer.address().port + '/');
  });

  // ---- redirect http --> https ----
  http.createServer(function (req, res) {
    console.log('REDIRECT http --> https');
    //res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.writeHead(301, { "Location": "https://" + req.headers['host'] });
    res.end();
  }).listen(80);
}
else {
  // --- http ---
  webServer = http.Server(app).listen(webPort, function () {
    console.log('Web server start. http://' + serverOptions.hostName + ':' + webServer.address().port + '/');
  });
}
//const wsServer = new WebSocketServer({ server: webServer });
//console.log('websocket server start. port=' + webServer.address().port );

// --- socket.io server ---
const io = require('socket.io')(webServer);
console.log('socket.io server start. port=' + webServer.address().port);

// --- file check ---
function isFileExist(path) {
  try {
    fs.accessSync(path, fs.constants.R_OK);
    //console.log('File Exist path=' + path);
    return true;
  }
  catch (err) {
    if (err.code === 'ENOENT') {
      //console.log('File NOT Exist path=' + path);
      return false
    }
  }

  console.error('MUST NOT come here');
  return false;
}


// ----- mediasoup ----
const mediasoup = require('mediasoup');

// multi-rooms
const rooms = [];

let server = mediasoup.Server({ logLevel: 'debug' });
server.on('close', function () {
  console.log('====== mediasoup server closed =======');
});
server.on('newroom', function (room) {
  console.log('-- mediasoup new room:' + room.id + ' --');
});

const mediaCodecs =
  [
    {
      kind: "audio",
      name: "opus",
      clockRate: 48000,
      channels: 2,
      parameters:
      {
        useinbandfec: 1
      }
    },
    {
      kind: "video",
      name: "VP8",
      clockRate: 90000
    },
    {
      kind: "video",
      name: "H264",
      clockRate: 90000,
      parameters:
      {
        "packetization-mode": 1,
        "profile-level-id": "42e01f",
        "level-asymmetry-allowed": 1
      }
    }
  ];

const defaultRoom = server.Room(mediaCodecs);
defaultRoom.on('newpeer', function (peer) {
  console.log('====== new peer in room === name=' + peer.name);
  peer.on('close', function (originator, appData) {
    console.log('===== peer closed ======');
  });
});

//defaultRoom.on('audiolevels', function(audioLevelInfos) {
//  console.log('-- audiolevels in room ---');
//});


// --- connections ---
//let Connections = new Array();
let clientIndex = 0;

// ============= socket.io =================

function getId(socket) {
  return socket.id;
}

function getClientCount() {
  // WARN: undocumented method to get clients number
  return io.eio.clientsCount;
}


// -------------- signaling ----

io.on('connection', function (socket) {
  let peer = null;
  let room = defaultRoom;
  console.log('client connected. socket id=' + getId(socket) + '  , total clients=' + getClientCount());

  socket.on('disconnect', function () {
    // close user connection
    console.log('client disconnected. socket id=' + getId(socket) + '  , total clients=' + getClientCount());
    //cleanUpPeer(socket);
    if (peer) {
      peer.close();
      peer = null;
    }

    // --- socket.io room ---
    const roomName = getRoomname();
    socket.leave(roomName);
  });
  socket.on('error', function (err) {
    console.error('socket ERROR:', err);
  });

  // --- setup room ---
  socket.on('prepare_room', roomId => {
    const existRoom = rooms[roomId];
    if (existRoom) {
      console.log('--- use exist room. roomId=' + roomId);
      room = existRoom;
      return;
    } else {
      console.log('--- create new room. roomId=' + roomId);
      room = server.Room(mediaCodecs);
      rooms[roomId] = room;
      room.on('close', () => {
        console.log('--- room closed. roomId=' + roomId);
        room.delete(roomId);
      });
    }

    // --- socket.io room ---
    socket.join(roomId);
    setRoomname(roomId);
  })

  socket.on('client_request', (request, callback) => {
    console.log('client_request.  method=' + request.method + ', target=' + request.target);
    //console.log('client_request callback:', callback)
    handleRequest(request, callback);
  });

  socket.on('client_notify', (notification) => {
    console.log('client_notify. method=' + notification.method + ', target=' + notification.target);
    handleNotify(notification);
  });

  function setRoomname(room) {
    socket.roomname = room;
  }

  function getRoomname() {
    const room = socket.roomname;
    return room;
  }

  // --- handle client request ----
  function handleRequest(request, callback) {
    //console.log('handleRequest() callback:', callback);
    if (request.method === 'queryRoom') {
      room.receiveRequest(request)
        .then((response) => {
          sendResponse(response, callback);
        })
        .catch((error) => {
          console.error('ERROR: ' + error.toString());
          sendReject(error, callback)
        });
    }
    else if (request.method === 'join') {
      console.log('join request:', request);
      const peerName = request.peerName;
      room.receiveRequest(request)
        .then((response) => {
          // Get the newly created mediasoup Peer
          peer = room.getPeerByName(peerName);
          handlePeer(peer);
          sendResponse(response, callback);
        })
        .catch((error) => {
          console.error('ERROR: ' + error.toString());
          sendReject(error, callback)
        });
    }
    else {
      if (peer) {
        peer.receiveRequest(request)
          .then((response) => {
            sendResponse(response, callback);
          })
          .catch((error) => {
            console.error('ERROR: ' + error.toString());
            sendReject(error, callback);
          });
      }
      else {
        console.error('ERROR: --- peer NOT READY ---');
      }
    }
  }

  // --- handle notify ---
  function handleNotify(notification) {
    if (!peer) {
      console.error('ERROR: Cannot handle mediaSoup notification, no mediaSoup Peer');
      return;
    }
    peer.receiveNotification(notification);
  }

  // --- handle peer event ---
  function handlePeer(peer) {
    peer.on('notify', (notification) => {
      console.log('New notification for peer received. name=' + notification.peerName + ', method=' + notification.method);
      sendNotification(notification);
    });

    peer.on('newtransport', (transport) => {
      console.log('New peer transport:', transport.direction);
      transport.on('close', (originator) => {
        console.log('Transport closed from originator:', originator);
      });
    });

    peer.on('newproducer', (producer) => {
      console.log('New peer producer:', producer.kind);
      producer.on('close', (originator) => {
        console.log('Producer closed from originator:', originator);
      });
    });

    peer.on('newconsumer', (consumer) => {
      console.log('New peer consumer:', consumer.kind);
      consumer.on('close', (originator) => {
        console.log('Consumer closed from originator', originator);
      });
    });

    // Also handle already existing Consumers.
    peer.consumers.forEach((consumer) => {
      console.log('peer existing consumer:', consumer.kind);
      consumer.on('close', (originator) => {
        console.log('Existing consumer closed from originator', originator);
      });
    });
  }

  // --- send response to client ---
  function sendResponse(response, callback) {
    //console.log('sendResponse() callback:', callback);
    callback(null, response);
  }

  // --- send notification to client ---
  function sendNotification(notification) {
    const message = { type: 'server_notify', notification: notification };
    sendback(socket, message);
  }

  function sendReject(error, callback) {
    callback(error.toString(), null);
  }

  // ---- sendback welcome message with on connected ---
  const newId = getId(socket);
  sendback(socket, { type: 'welcome', id: newId });
});

function sendback(socket, message) {
  socket.emit('message', message);
}

function cleanUpPeer(socket) {
  const id = getId(socket);
  if (defaultRoom) {
    const peer = defaultRoom.getPeerByName(id);
    if (peer) {
      peer.close();
    }
    else {
      console.warn('NO peer for id=' + id);
    }
  }
}


