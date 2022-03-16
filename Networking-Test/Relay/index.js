const { io } = require("socket.io-client");

const socket = io('http://localhost:3100');

socket.on('connect', () => {
    socket.emit('type', 'RELAY');
});

socket.on('rl-openConnection', (data) => {
    console.log('GOT openConnection', data);
})