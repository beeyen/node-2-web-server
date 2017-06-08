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


io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newEmail', {
    from: 'abc@yahoo.com',
    text: 'hello world!',
    timeStamp: new Date()
  });

  socket.emit('newMessage', {
    from: 'Sam Gao',
    text: 'hello world!',
    createAt: new Date()
  });

  socket.on('createMessage', (message) => {
    console.log('New Message created ', message);
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(port, () => {
  console.log('Server starting on port ' + port);
});
