const net = require('net');


class RelayEntity {
    constructor(extIP, extPort, toIP, toPort) {
        this.extIP = extIP;
        this.extPort = extPort;
        this.toIP = toIP;
        this.toPort = toPort;
        this.server = null;
    }
    start() {
        this.server = net.createServer((input) => {
            console.log('Relay got connection');

            const output = new net.Socket();
            output.connect(this.extPort, this.extIP, () => {
                console.log('Relay Established Handshake');
            });

            output.on('data', (svdata) => {
                input.write(svdata);
            });

            input.on('data', (cldata) => {
                output.write(cldata);
            });

            input.on('close', () => {
                console.log('Relay got Input closed');
                output.end();
            });
            output.on('close', () => {
                console.log('Relay got Output closed');
                input.end();
            });
        });

        this.server.listen(this.toPort, this.toIP);
        console.log('Relay Listening:');
        console.log(`  ${this.extIP}:${this.extPort} => ${this.toIP}:${this.toPort}`);
    }
}

// const re = new RelayEntity('164.132.170.199', 25518, '127.0.0.1', 10337);
// re.start();

const re = new RelayEntity('45.88.109.32', 22, '127.0.0.1', 777);
re.start();

// 25518