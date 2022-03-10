const FtpSrv = require('ftp-srv');
const ftpServer = new FtpSrv({ url: 'ftp://localhost:7878' });
const path = require('path');

ftpServer.on('login', ({ connection: { id }, username, password }, resolve, reject) => {
    console.log(id, username, password);
    if (username == 'test' && password == 123) {
        return resolve({
            root: '/',
            // cwd: '../node_modules/',
        });
    } else {
        return reject({});
    }
});

ftpServer.listen()
    .then(() => console.log('Listening'));