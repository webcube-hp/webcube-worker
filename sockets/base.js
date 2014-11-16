var net = require('net');
var request = require('request');
var fs = require('fs');

var playerCount = 1;
var code;
var socketio = {};
var unixSock = [];

var player1 = {
  action: 0,
}

var path1 = '/tmp/p1.sock'
fs.unlink(path1, function () {
  var server = net.createServer(function(c) {
    console.log('server connected');
    c.on('end', function() {
      console.log('server disconnected');
    });
    c.write('hello\r\n');
  });
  server.listen(path1, function() {
    console.log('server bound on %s', path1);
  });
});

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
      player1.action = '1';
      // console.log('test');
      // var c = socketio[socket.id];
      // c.write('lalalala');
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