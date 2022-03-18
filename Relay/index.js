const Relay = require('./src/Relay');
const RelayEntity = require('./src/RelayEntity');

const { io } = require("socket.io-client");

const socket = io('http://localhost:3100');

const authValues = {
    iv: '3f5e2acb93a81395983af8ae86e23f5d',
    content: '6c50b3224e05f0123d782c422ed9c855d7b72f2d77f7095b2dc9bcceca0de41bd7'
};

const relay = new Relay();

socket.on('connect', () => {
    socket.emit('auth', authValues);
});

socket.on('auth-success', () => {
    console.log('Got Authentication-Success! The System is now ready to work');
});

socket.on('auth-error', ({ message }) => {
    console.log('Got Authentication-Error:', message);
});


socket.on('rl-conn-open', (data) => {
    console.log('GOT openConnection', data);
    //     const re = new RelayEntity('164.132.170.199', 25518, '127.0.0.1', 10337);
    // relay.insert(re);
});

