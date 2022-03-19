const initialize = (socket) => {
    socket.on('rl-conn-crash', (data) => {
        console.log('GOT Connection-Crash ', data);

        socket.emit('rl-conn-open', ({ extPort: 1337, intPort: 25567 }));
    });
}

module.exports = {
    initialize,
}