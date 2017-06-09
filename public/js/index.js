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

socket.on('newLocationMessage', function(message) {
  console.log('Got new message: ', message);
  var liElement = jQuery('<li></li>');
  var a = jQuery('<a target="_blank" href="">My Current Location</a>');
  liElement.text(`${message.from}: `);
  a.attr('href', message.url);
  liElement.append(a);
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

var locationButton = jQuery('#send-location');
var locationText = jQuery('<div></div>');
var locationMap = jQuery('#output');

locationButton.on('click', function() {
  // clear the output
  locationMap.empty();
  if ("geolocation" in navigator) {
    /* geolocation is available */
    locationText.text('locating....');
    locationMap.append(locationText);
    navigator.geolocation.getCurrentPosition(function(position) {
        //do_something(position.coords.latitude, position.coords.longitude);
        console.log(position);
        var latitude  = position.coords.latitude;
        var longitude = position.coords.longitude;
        locationText.text(`Latitude: ${latitude} | Longtitue: ${longitude}`);
        var img = new Image();
        img.src = 'https://maps.googleapis.com/maps/api/staticmap?center=' + latitude + ',' + longitude + '&zoom=13&size=300x300&sensor=false';
        locationMap.append(img);
        socket.emit('createLocationMessage', {latitude: latitude, longitude: longitude});
    }, function() {
      alert('Unable to fetch location.');
    });
  } else {
    /* geolocation IS NOT available */
    return alert('Geolocation is not supported');
  }
});
