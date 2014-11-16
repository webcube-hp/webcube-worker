var net = require('net');
var request = require('request');
var fs = require('fs');

var playerCount = 1;
var code;
var socketio = {};
var unixSock = [];

// unixSock[0] = new net.Socket();
// unixSock[1] = new net.Socket();
// unixSock[2] = new net.Socket();
// unixSock[3] = new net.Socket();

// unixSock[0].connect('/tmp/p1.sock');
// unixSock[1].connect('/tmp/p2.sock');
// unixSock[2].connect('/tmp/p3.sock');
// unixSock[3].connect('/tmp/p4.sock');

function setupConnection(c, path) {
  c.connect(path, function () {
  });

  c.on('close', function() {
    console.log('Connection closed');
  });

  c.on('error', function() {
    console.log('Connection error');

    setTimeout(setupConnection, 1000); //Try to reconnect
  });
}

module.exports = function(io) {
  io.on('connection', function(socket) {
    console.log('connection');
    unixSock[playerCount - 1] = new net.Socket();
    var c = unixSock[playerCount - 1];
    // c.connect('/tmp/p' + playerCount + '.sock');
    setupConnection(c, '/tmp/p' + playerCount + '.sock');
    socketio[socket.id] = c;
    playerCount++;

    socket.on('joined', function(data) {
      code = data.code;
    })

    socket.on('action', function(data) {
      console.log('test');
      var c = socketio[socket.id];
      c.write('lalalala');
    })

    socket.on('disconnect', function() {
      playerCount--;
      if (playerCount == 0) {
        request('http://theotherserver.com/ended?code=' + code, function(err, request, body) {
          if (err) {
            console.log("Error: something is wrong: ", err);
          }
        });
      };
    })
  })
}