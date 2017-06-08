var socket = io();
socket.on('connect', function(){
  console.log('Connect to server');
});
socket.on('disconnect', function() {
  console.log('Disconnected to server');
});

socket.on('newMessage', function(message) {
  console.log('Got new message: ', message);
})
