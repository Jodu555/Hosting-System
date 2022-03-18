const { io } = require("socket.io-client");

const socket = io('http://localhost:3100');

const authValues = {
    iv: '1a0145e7f487e45355129733a2cb899e',
    content: 'd158e5f9163dc401dc6ac12204e648b98cccbd77a992ce79d99cc84025e815a34ce5c988'
};

socket.on('connect', () => {
    socket.emit('auth', authValues);


});

socket.on('auth-success', () => {
    console.log('Got Authentication-Success! The System is now ready to work');
});

socket.on('auth-error', ({ message }) => {
    console.log('Got Authentication-Error:', message);
});





