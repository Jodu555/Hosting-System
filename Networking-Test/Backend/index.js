const http = require('http');
const express = require('express');
const { Server } = require("socket.io");
const https = require('https');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv').config();

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

io.on('connection', (socket) => {
    console.log('Backend: Connection:', socket.id);

    socket.on('auth', ({ type, key }) => {
        type = type.toLowerCase();
        if (type == 'relay' && key !== 'SUPER-SECURE-RELAY-KEY')
            return console.log('Got an unsecure authorization!');

        console.log(`Socket with ${socket.id}-ID proposed as ${type}`);
        socket.auth = { type, key };

        if (type == 'relay')
            socketInitRelay(socket);
    });



})


const socketInitRelay = (socket) => {
    socket.on('connectionCrash', (data) => {
        console.log(socket.auth);
        console.log('GOT Connection-Crash ', data);

        socket.emit('rl-openConnection', ({ extPort: 1337, intPort: 25567 }));
    });
}



// Your Middleware handlers here


const PORT = process.env.PORT || 3100;
server.listen(PORT, () => {
    console.log(`Express App Listening ${process.env.https ? 'with SSL ' : ''}on ${PORT}`);
});