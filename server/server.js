const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');


var app = express();
app.use(express.static(publicPath));

const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);

var client = 0;

io.on('connection', (socket) => {
  client++;
  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to chat app!'
  });
  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: client + ' User(s) Joined!',
    createdAt: new Date().getTime()
  });
  socket.on('createMessage', (message) => {
    console.log('New Message created ', message);
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });



  socket.on('disconnect', () => {
    client--;
    console.log('User was disconnected');
    socket.broadcast.emit('newMessage', {
      description: client + ' clients connected.'
    })
  });
});

server.listen(port, () => {
  console.log('Server starting on port ' + port);
});
