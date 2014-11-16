$(function() {
  var socket = io.connect(window.location.host);
  socket.emit('joined', {code: window.webHpCode, ip: window.webHpIp})

  $(window).on('click', function() {
    console.log('test');
    socket.emit('action', {});
  })
})