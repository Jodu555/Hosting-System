const FTPServer = require('./FTPServer.js')

const server = new FTPServer('127.0.0.1', '7878')
server.onAuthenticate((username, password) => {
    if (username == 'test' && password == '123') {
        return {
            success: true,
            root: process.cwd(),
        }
    } else {
        return {
            success: false,
        }
    }
});
server.listen();