const ftpd = require('ftpd');

class FTPServer {
    constructor(host, port) {
        this.host = host;
        this.port = port;
        this.server = new ftpd.FtpServer({
            host: this.host,
            port: this.port
        }, {
            getInitialCwd: (connection) => {
                console.log(1337, connection.auth);
                return '/'
            },
            getRoot: (connection) => {
                console.log(77477, connection.auth);
                return connection?.auth?.result?.root || process.cwd();
            },
            pasvPortRangeStart: 1025,
            pasvPortRangeEnd: 1050,
            allowUnauthorizedTls: true,
            useWriteFile: false,
            useReadFile: false,
            uploadMaxSlurpSize: 7000, // N/A unless 'useWriteFile' is true.
        });
    }

    listen() {
        this.server.on('error', (error) => {
            console.log('FTP Server error:', error);
        });


        this.server.on('client:connected', async (connection) => {
            console.log('client connected: ');

            const { username, success: usr_success, failure: usr_failure } = await new Promise((resolve, reject) => {
                connection.once('command:user', (username, success, failure) => {
                    resolve({ username, success, failure })
                });
            })
            if (!username)
                return usr_failure();

            usr_success();

            const { password, success: pw_success, failure: pw_failure } = await new Promise((resolve, reject) => {
                connection.once('command:pass', async (password, success, failure) => {
                    resolve({ password, success, failure })
                });
            })

            if (!password)
                return pw_failure();

            const result = await this.authFunction(username, password);

            if (!result.success)
                return pw_failure();


            connection.auth = { username, password, result };
            pw_success(username);

        });
        // server.debugging = 4;
        this.server.listen(this.port);
        console.log('Listening on port ' + this.port);
    }

    onAuthenticate(cb) {
        this.authFunction = cb;
    }
}

module.exports = FTPServer;