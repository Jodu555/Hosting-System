const FtpSrv = require('ftp-srv');
const ftpServer = new FtpSrv({
    url: 'ftp://localhost:7878',
    whitelist: ['PWD', 'TYPE', 'PASV', 'USER', 'PASS'],
    file_format: (...data) => {
        console.log(1337, ...data);
        return null;
    }
});
const path = require('path');

ftpServer.on('login', ({ connection: { id }, username, password }, resolve, reject) => {
    console.log(id, username, password);
    if (username == 'test' && password == 123) {
        const root = path.join(__dirname, '..', 'node_modules')
        console.log(root);
        return resolve({
            root,
            // root: '../node_modules',
            cwd: '/',
            whitelist: ['PWD', 'TYPE', 'PASV'],
            greeting: 'Welcome'
        });
    } else {
        return reject({});
    }
});

ftpServer.listen()
    .then(() => console.log('Listening'));