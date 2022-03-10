

return;
const { FtpSrv, FileSystem } = require('ftp-srv');
const ftpServer = new FtpSrv({
    url: 'ftp://localhost:7878',
    whitelist: ['PWD', 'TYPE', 'PASV', 'USER', 'PASS', 'FEAT', 'SYST', 'TYPE'],
    // file_format: (...data) => {
    //     console.log(1337, ...data);
    //     return null;
    // }
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
            greeting: 'Welcome',
            // fs: new MyFileSystem(connection)
        });
    } else {
        return reject({});
    }
});

ftpServer.listen()
    .then(() => console.log('Listening'));


class MyFileSystem extends FileSystem {
    constructor() {
        console.log(...arguments);
        super(...arguments);
    }
    currentDirectory() {
        console.log(1, this);
    }
    get(name) {
        console.log(2, name, this);
    }
    list(path) {
        console.log(3, path, this);
    }

}

