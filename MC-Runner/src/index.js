const FTPServer = require('./FTPServer.js')
const path = require('path')


const server = new FTPServer('127.0.0.1', '7878')
server.onAuthenticate((username, password) => {
    if (username == 'test' && password == '123') {
        return {
            success: true,
            root: path.join(process.cwd(), 'data', 'usr_1'),
        }
    } else if (username == 'asdf' && password == '456') {
        return {
            success: true,
            root: path.join(process.cwd(), 'data', 'usr_2'),
        }
    } else {
        return {
            success: false,
        }
    }
});
server.listen();