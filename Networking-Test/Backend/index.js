const http = require('http');
const express = require('express');
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const https = require('https');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv').config();
const { encrypt, decrypt } = require('./crypt.js');


// const test = { a: 1, b: 2, ob: { lol: 3 } };
// // const other = { ...test };
// // const other = JSON.parse(JSON.stringify(test)); // This is the only Possible way to clone an obj without deep reference
// // const other = Object.assign(test, {});
// other.a = 3;
// other.ob.lol = 7;

// console.log(test, other);

// const { Database } = require('@jodu555/mysqlapi');
// const database = Database.createDatabase('localhost', 'root', '', 'rt-chat');
// database.connect();
// require('./utils/database')();

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

let server;
if (process.env.https) {
    const sslProperties = {
        key: fs.readFileSync(process.env.KEY_FILE),
        cert: fs.readFileSync(process.env.CERT_FILE),
    };
    server = https.createServer(sslProperties, app)
} else {
    server = http.createServer(app);
}

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

console.log(encrypt(JSON.stringify({ type: 'MCRUNNER', ip: '127.0.0.1' })));

instrument(io, {
    auth: {
        type: "basic",
        username: "admin",
        password: "$2b$10$heqvAkYMez.Va6Et2uXInOnkCT6/uQj1brkrbyG3LpopDklcq7ZOS" // "changeit" encrypted with bcrypt
    },
});

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


const socketInitMCRunner = (socket) => {

};

const socketInitRelay = (socket) => {
    socket.on('rl-conn-crash', (data) => {
        console.log(socket.auth);
        console.log('GOT Connection-Crash ', data);

        socket.emit('rl-conn-open', ({ extPort: 1337, intPort: 25567 }));
    });
};



// Your Middleware handlers here


const PORT = process.env.PORT || 3100;
server.listen(PORT, () => {
    console.log(`Express App Listening ${process.env.https ? 'with SSL ' : ''}on ${PORT}`);
});