const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');
const {generateMessage, generateLocationMessage} = require('./utils/message');

var app = express();
app.use(express.static(publicPath));

const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);

var client = 0;

io.on('connection', (socket) => {
  client++;
  socket.emit('newMessage', generateMessage('Admin', 'Welcome'));
  //socket.broadcast.emit('newMessage', generateMessage('Admin', client + ' User(s) Joined!'));
  socket.on('createMessage', (message, callback) => {
    console.log('New Message created ', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    if (callback) {
      callback('This is from the server!');
    }
  });

  socket.on('createLocationMessage', (coords) => {
    console.log('New Location created ', coords);
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    client--;
    console.log('User was disconnected');
  });
});

server.listen(port, () => {
  console.log('Server starting on port ' + port);
});
