var socket = io();


var locationButton = jQuery('#send-location');
var locationText = jQuery('<div></div>');
var locationMap = jQuery('#output');


socket.on('connect', function(){
  console.log('Connect to server');
  var params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function(err) {
    if (err) {
      console.log('err');
      window.location.href = '/';
    } else {
      console.log('no error')
    }
   });
});

socket.on('disconnect', function() {
  console.log('Disconnected to server');
});

socket.on('updateUsers', function(users) {
  console.log('update users list');
  var ol = jQuery('<ol></ol>');
  users.forEach(function(user) {
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);
})

socket.on('newMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('hh:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  // var formattedTime = moment(message.createdAt).format('hh:mm a');
  // console.log('Got new message: ', message);
  // var liElement = jQuery('<li></li>');
  // liElement.text(`${message.from}: ${message.text} at ${formattedTime}`);
  // jQuery('#messages').append(liElement);
});

socket.on('newLocationMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('hh:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  // console.log('Got new message: ', message);
  // var formattedTime = moment(message.createdAt).format('hh:mm a');
  // var liElement = jQuery('<li></li>');
  // var a = jQuery('<a target="_blank" href="">My Current Location</a>');
  // liElement.text(`${message.from} ${formattedTime}:`);
  // a.attr('href', message.url);
  // liElement.append(a);
  // jQuery('#messages').append(liElement);
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  var inputEl = jQuery('[name=message]');
  socket.emit('createMessage', {
    text: inputEl.val()
  }, function(data) {
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
