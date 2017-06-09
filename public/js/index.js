var socket = io();

socket.on('connect', function(){
  console.log('Connect to server');
});
socket.on('disconnect', function() {
  console.log('Disconnected to server');
});

socket.on('newMessage', function(message) {
  console.log('Got new message: ', message);
  var liElement = jQuery('<li></li>');
  liElement.text(`${message.from}: ${message.text}`);
  jQuery('#messages').append(liElement);
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'user',
    text: jQuery('[name=message]').val()
  }, function(data) {
    console.log('GOT IT FROM FORM!' + data);
  });
})
