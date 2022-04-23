const Relay = require('./Relay');
const RelayEntity = require('./RelayEntity');

const { io } = require("socket.io-client");
const Config = require('./utils/Config');


const config = new Config({
    RELAY_IP: 'PUT HERE THE EXTERNAL RELAY IP | So the IP of this machine',
    BACKEND_IP: 'PUT HERE THE IP OF YOUR BACKEND SERVER',
    authValues: {
        iv: 'PUT HERE YOUR IV',
        content: 'PUT HERE YOUR CONTENT'
    }
});

const socket = io(config.get().BACKEND_IP);

const relay = new Relay();

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
    const re = new RelayEntity('164.132.170.199', 25518, '127.0.0.1', 10337);
    relay.insert(re);
});

