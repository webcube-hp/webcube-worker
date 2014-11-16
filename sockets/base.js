var net = require('net');
var request = require('request');
var fs = require('fs');

var playerCount = 1;
var code;
var ip;
var socketio = {};
var unixSock = [];

var players = [];
players[0] = {
  a: 0,
  b: 0,
  x: 0,
  r: 0,
  z: 0,
  start: 0,
  joystick: {
    x: 0,
    y: 0
  },
}
players[1] = {
  a: 0,
  b: 0,
  x: 0,
  r: 0,
  z: 0,
  start: 0,
  joystick:  {
    x: 0,
    y: 0
  },
}
players[2] = {
  a: 0,
  b: 0,
  x: 0,
  r: 0,
  z: 0,
  start: 0,
  joystick:  {
    x: 0,
    y: 0
  },
}
players[3] = {
  a: 0,
  b: 0,
  x: 0,
  r: 0,
  z: 0,
  start: 0,
  joystick:  {
    x: 0,
    y: 0
  },
}

var path1 = '/tmp/p1.sock'
fs.unlink(path1, function () {
  var server = net.createServer(function(c) {
    console.log('server connected');
    c.on('end', function() {
      console.log('server disconnected');
    });
    c.on('data', function(data) {
      console.log('got data')
      switch (data) {
        case 0:
          var buf = new Buffer([players[0].a]);
          c.write(buf);
          break;
        case 1:
          var buf = new Buffer([players[0].b]);
          c.write(buf);
          break;
        case 2:
          var buf = new Buffer([players[0].x]);
          c.write(buf);
          break;
        case 3:
          var buf = new Buffer([players[0].r]);
          c.write(buf);
          break;
        case 4:
          var buf = new Buffer([players[0].z]);
          c.write(buf);
          break;
        case 5:
          var buf = new Buffer([players[0].start]);
          c.write(buf);
          break;
        case 6:
          var buf = new Buffer([players[0].x]);
          c.write(buf);
          break;
        case 7:
          var buf = new Buffer([players[0].y]);
          c.write(buf);
          break;
      }
    })
    c.write('hello\r\n');
  });
  server.listen(path1, function() {
    console.log('server bound on %s', path1);
  });
});

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
    // unixSock[playerCount - 1] = new net.Socket();
    // var c = unixSock[playerCount - 1];
    // c.connect('/tmp/p' + playerCount + '.sock');
    // setupConnection(c, '/tmp/p' + playerCount + '.sock');
    socketio[socket.id] = playerCount - 1;
    playerCount++;

    socket.on('joined', function(data) {
      code = data.code;
      ip = data.ip;
    })

    socket.on('button up', function(data) {
      console.log(data);
      var num = socketio[socket.id];
      players[num][data.button] = 0;
    })

    socket.on('button down', function(data) {
      console.log(data);
      var num = socketio[socket.id];
      players[num][data.button] = 1;
    })

    socket.on('button joystick', function(data) {
      var num = socketio[socket.id];
      players[num].joystick.x = data.x;
      players[num].joystick.y = data.y;
      console.log(players[num]);
    })

    // socket.on('action', function(data) {
    //   player1.action = '1';
    //   // console.log('test');
    //   // var c = socketio[socket.id];
    //   // c.write('lalalala');
    // })

    socket.on('disconnect', function() {
      console.log('disconnected', playerCount);
      playerCount--;
      if (playerCount == 1) {
        request('http://localhost:3000/ended?code=' + code + '&ip=' + ip, function(err, request, body) {
          if (err) {
            console.log("Error: something is wrong: ", err);
          }
        });
      };
    })
  })
}