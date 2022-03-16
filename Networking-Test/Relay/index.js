const { io } = require("socket.io-client");

const socket = io('http://localhost:3100');

socket.on('connect', () => {
    socket.emit('auth', { type: 'RELAY', key: 'SUPER-SECURE-RELAY-KEY' });


    socket.timeout(1000).emit('connectionCrash', ({ UUID: '123' }));
});


socket.on('rl-openConnection', (data) => {
    console.log('GOT openConnection', data);
});


