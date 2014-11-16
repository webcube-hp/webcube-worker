$(function() {
  var socket = io.connect(window.location.host);
  socket.emit('joined', {code: window.webHpCode})

  $(window).on('click', function() {
    console.log('test');
    socket.emit('action', {});
  })
})