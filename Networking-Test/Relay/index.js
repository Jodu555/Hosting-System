const { io } = require("socket.io-client");

const socket = io('http://localhost:3100');

const authValues = {
    iv: '3f5e2acb93a81395983af8ae86e23f5d',
    content: '6c50b3224e05f0123d782c422ed9c855d7b72f2d77f7095b2dc9bcceca0de41bd7'
};

socket.on('connect', () => {
    socket.emit('auth', authValues);


    socket.timeout(1000).emit('rl-conn-crash', ({ UUID: '123' }));
});


socket.on('rl-conn-open', (data) => {
    console.log('GOT openConnection', data);
});


