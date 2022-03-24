const Relay = require('./Relay');
const RelayEntity = require('./RelayEntity');

const { io } = require("socket.io-client");
const Config = require('./Config');

const socket = io('http://localhost:3100');

// const authValues = {
//     iv: '3f5e2acb93a81395983af8ae86e23f5d',
//     content: '6c50b3224e05f0123d782c422ed9c855d7b72f2d77f7095b2dc9bcceca0de41bd7'
// };

const relay = new Relay();

const config = new Config({
    RELAY_IP: 'PUT HERE THE EXTERNAL RELAY IP | So the IP of this machine',
    BACKEND_IP: 'PUT HERE THE IP OF YOUR BACKEND SERVER',
    authValues: {
        iv: 'PUT HERE YOUR IV',
        content: 'PUT HERE YOUR CONTENT'
    }
});

socket.on('connect', () => {
    socket.emit('auth', config.get().authValues);
});

socket.on('auth-success', () => {
    console.log('Got Authentication-Success! The System is now ready to work');
});

socket.on('auth-error', ({ message }) => {
    console.log('Got Authentication-Error:', message);
});


socket.on('rl-conn-open', ({ extPort, intPort }) => {
    console.log('GOT openConnection', extPort, intPort);
    // const re = new RelayEntity('164.132.170.199', 25518, '127.0.0.1', 10337);
    // relay.insert(re);
});

