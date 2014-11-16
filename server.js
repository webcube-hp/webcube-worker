var socketio = require('socket.io');
 
// Listen on port 3636
var io = socketio.listen(3636);
 
io.sockets.on('connection', function (socket) {
 	console.log("somebody connected!");
    // Broadcast a user's message to everyone else in the room
    socket.on('input', function (data) {
    	console.log("Received: " + JSON.stringify(data));
        io.sockets.emit('message', data);
    });
 
});