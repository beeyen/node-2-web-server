var socket = io();


var locationButton = jQuery('#send-location');
var locationText = jQuery('<div></div>');
var locationMap = jQuery('#output');


socket.on('connect', function(){
  console.log('Connect to server');
});
socket.on('disconnect', function() {
  console.log('Disconnected to server');
});

socket.on('newMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('hh:mm a');
  console.log('Got new message: ', message);
  var liElement = jQuery('<li></li>');
  liElement.text(`${message.from}: ${message.text} at ${formattedTime}`);
  jQuery('#messages').append(liElement);
});

socket.on('newLocationMessage', function(message) {
  console.log('Got new message: ', message);
  var formattedTime = moment(message.createdAt).format('hh:mm a');
  var liElement = jQuery('<li></li>');
  var a = jQuery('<a target="_blank" href="">My Current Location</a>');
  liElement.text(`${message.from} ${formattedTime}:`);
  a.attr('href', message.url);
  liElement.append(a);
  jQuery('#messages').append(liElement);
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  var inputEl = jQuery('[name=message]');
  socket.emit('createMessage', {
    from: 'user',
    text: inputEl.val()
  }, function(data) {
    console.log('GOT IT FROM FORM!' + data);
    inputEl.val('');
  });
})

locationButton.on('click', function() {
  // clear the output
  locationMap.empty();
  if ("geolocation" in navigator) {
    /* geolocation is available */
    locationButton.attr('disabled',true).text('Sending location...');
    locationMap.append(locationText);
    navigator.geolocation.getCurrentPosition(function(position) {
        locationButton.removeAttr('disabled').text('Send location');
        console.log(position);
        var latitude  = position.coords.latitude;
        var longitude = position.coords.longitude;
        locationText.text(`Latitude: ${latitude} | Longtitue: ${longitude}`);
        var img = new Image();
        img.src = 'https://maps.googleapis.com/maps/api/staticmap?center=' + latitude + ',' + longitude + '&zoom=13&size=300x300&sensor=false';
        locationMap.append(img);
        socket.emit('createLocationMessage', {latitude: latitude, longitude: longitude});
    }, function() {
      locationButton.removeAttr('disabled').text('Send location');
      alert('Unable to fetch location.');
    });
  } else {
    /* geolocation IS NOT available */
    return alert('Geolocation is not supported');
  }
});
