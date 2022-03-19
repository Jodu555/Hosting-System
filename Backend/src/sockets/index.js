const { decrypt } = require("../utils/crypt");
const { getIo } = require("../utils/utils");

const initialize = () => {
    const io = getIo();

    io.on('connection', (socket) => {
        console.log('Backend: Connection:', socket.id);

        const authError = (msg) => {
            console.error(msg);
            socket.emit('auth-error', { message: msg });
        };

        socket.on('auth', (authValue) => {
            let type;
            let ip;
            try {
                const { type: lc_type, ip: lc_ip } = JSON.parse(decrypt(authValue));
                type = lc_type;
                ip = lc_ip;
            } catch (error) {
                authError('Your hash isnt properly generated!')
                return;
            }
            if (!socket.handshake.address.includes(ip)) {
                authError('The ip you provided in the hash dont matches with yours!')
                return;
            }
            type = type.toLowerCase();
            if (type !== 'relay' && type !== 'mcrunner') {
                authError('Your Provided type dont matches with ours!')
                return;
            }

            console.log(`Socket with ${socket.id}-ID from: ${ip} proposed as ${type}`);
            socket.auth = { type, ip };

            socket.emit('auth-success');

            if (type == 'relay')
                socketInitRelay(socket);

            if (type == 'mcrunner')
                socketInitMCRunner(socket);

        });



    })

}

module.exports = {
    initialize
};