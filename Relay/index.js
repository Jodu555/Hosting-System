const net = require('net');
const { randomUUID } = require('crypto');


class RelayEntity {
    constructor(extIP, extPort, toIP, toPort) {
        this.extIP = extIP;
        this.extPort = extPort;
        this.toIP = toIP;
        this.toPort = toPort;
        this.server = null;
    }
    stop() {
        this.server.close(() => console.log('Relay Closed'));
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

class Relay {
    constructor() {
        this.relays = [];
    }
    insert(relay) {
        this.relays.push(relay);
    }
    delete(extPort) {
        const relay = this.relays.find(e => e.extPort == extPort);
        const relayIdx = this.relays.findIndex(e => e.extPort == extPort);

        relay.stop();

        this.relays.splice(relayIdx, 1)

    }

}

// new RelayEntity('THE IP the server has', the port the server has, 'the ip the relay has', the port the relay has);

const relay = new Relay();

const re = new RelayEntity('164.132.170.199', 25518, '127.0.0.1', 10337);

relay.insert(re);

relay.delete(25518)


// re.start();

// 25518