var express = require('express');
var socket = require('socket.io');

//app
var app = express();
var server = app.listen(3000);

app.use(express.static('public03'));
console.log('server is connected');

//Socket
var io = socket(server);
io.on('connection', (socket) => {
  console.log("a user connected");

  socket.on('snakeLocation', (snakeData) => {
    io.emit('snakeLocation', snakeData);
  });

  socket.on('touchEvent', (clientData) => {
    io.emit('touchEvent', clientData);
  });

  socket.on('foodLocation', (foodData) => {
    io.emit('foodLocation', foodData);
  });

  socket.on('tailInfo', (tailData) => {
    io.emit('tailInfo', tailData);
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});
