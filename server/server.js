const cool = require('cool-ascii-faces');
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

var app = express();
app.use(express.static(publicPath));

const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);
var users = new Users();

var client = 0;

io.on('connection', (socket) => {
  client++;
  console.log(cool());

  socket.on('join', (params, callback)=>{
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and room are required')
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUsers', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} Joined!`));
    callback();
  });

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
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUsers', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} have left the room!`))
    }
  });
});

server.listen(port, () => {
  console.log('Server starting on port ' + port);
});
