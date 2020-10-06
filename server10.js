var express = require('express');
var socket = require('socket.io');

//app
var app = express();
var server = app.listen(3000);

app.use(express.static('public10'));
console.log('server is connected');

//Socket
var io = socket(server);
io.on('connection', (socket) => {
    console.log("a user connected");

    socket.on('snakeLocation', (snakeData) => {
        io.emit('snakeLocation', snakeData);
        console.log(snakeData);
    });

    socket.on('foodLocation', (foodData) => {
        io.emit('foodLocation', foodData);
    });

    socket.on('downkeyEvent', (keyData) => {
        io.emit('downKeyEvent', keyData);
    });
    
    socket.on('upKeyEvent', (keyData) => {
        io.emit('upKeyEvent', keyData);
    });

    socket.on('disconnect', () => {
        console.log('disconnected');
    });
});
