const { io } = require("socket.io-client");

const socket = io('http://localhost:3100');

socket.on('connect', () => {
    socket.emit('auth', { type: 'MCRUNNER', key: 'SUPER-SECURE-MCRUNNER-KEY' });


});




