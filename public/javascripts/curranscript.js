var socket = io.connect(window.location.host);
socket.emit('joined', {code: window.webHpCode, ip: window.location.host})


$(function(){
// $("#left").wind
  $.get("/start_game", {}, function() {
    console.log('started');
  })
  function downHandler( event ){
      console.log("down bam")
        socket.emit('button down', {"button": $( event.target ).attr('id')})
        //$( event.target ).addClass( "pressed" )
    };
  function upHandler( event ){
      console.log("up bam")
        socket.emit('button up', {"button": $( event.target ).attr('id')})
        //$( event.target ).removeClass( "pressed" );
    };
  function joyHandler( event ){
     console.log("joys bam")
     console.log(event);
    var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
    var hitWidth = $("#hit-area").width();
    var hitHeight = $("#hit-area").height();
    console.log("width: " +hitWidth+ "height: " + hitHeight);
    //console.log("x: " +event.offsetX+ "y: " + event.offsetY);
      var x = (touch.clientX - hitWidth/2)/(hitWidth/2);
      var y = -(touch.clientY - hitHeight/2)/(hitHeight/2);
      if(x < -1) x = -1;
    else if(x > 1) x = 1;
      if(y < -1) y = -1;
      else if(y > 1) y = 1;
      console.log("x: " +x+ "y: " + y);
      socket.emit('button joystick', {"x": x, "y": y});
      event.preventDefault();
    };
    // $('body').bind('touchend', function(e){
    //   socket.emit('input', {"x": 0, "y": 0});
    //   e.preventDefault();
    // });
  $( ".button" ).on( "touchstart", downHandler );
  $( ".button" ).on( "touchend", upHandler);
  $( "#hit-area").on( "touchmove", joyHandler);
});