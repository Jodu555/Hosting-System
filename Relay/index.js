const net = require('net');
class RelayEntity {
    /**
     * @param  {String} intIP The Internal IP of the server
     * @param  {Number} intPort The Internal Port of the server
     * @param  {String} extIP The Excternal IP the relay has
     * @param  {Number} extPort The External Port the relay has
     */
    constructor(intIP, intPort, extIP, extPort) {
        this.intIP = intIP;
        this.intPort = intPort;
        this.extIP = extIP;
        this.extPort = extPort;
        this.server = null;
    }

    /**
     * Stop the relay
     */
    stop() {
        this.server.close(() => console.log('Relay Closed'));
    }
    /**
     * Start the relay
     */
    start() {
        this.errorCatch = (error) => {
            console.log('Catched');
        }
        this.server = net.createServer((input) => {
            try {
                console.log('Relay got connection');

                const output = new net.Socket();
                output.connect(this.intPort, this.intIP, () => {
                    console.log('Relay Established Handshake');
                });

                output.on('data', (svdata) => {
                    //Packets vom Server
                    console.log('Packet from Server', svdata.toString());
                    console.log(new Packet(svdata));
                    input.write(svdata);
                });

                input.on('data', (cldata) => {
                    //Packets vom Client
                    console.log('Packet from Client', cldata.toString());
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
                input.on('error', this.errorCatch);
                output.on('error', this.errorCatch);


            } catch (error) {
                console.log('Catched');
            }
        });

        this.server.listen(this.extPort, this.extIP);
        console.log('Relay Listening:');
        console.log(`  ${this.intIP}:${this.intPort} => ${this.extIP}:${this.extPort}`);
    }
}

class Relay {
    constructor() {
        /**
         * @type {[RelayEntity]}
         */
        this.relays = [];
    }
    /**
     * @param  {RelayEntity} relay
     */
    insert(relay) {
        relay.start();
        this.relays.push(relay);
    }
    delete(intPort) {
        const relay = this.relays.find(e => e.intPort == intPort);
        const relayIdx = this.relays.findIndex(e => e.intPort == intPort);

        relay.stop();

        this.relays.splice(relayIdx, 1)
    }

}

function toHexString(byteArray) {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

class ServerStatusDes {
    constructor(data) {
        this.data = data;
    }
}


// new RelayEntity('THE internal IP the server has', the internal port the server has, 'the external ip the relay has', the external port the relay has);

const relay = new Relay();

const re = new RelayEntity('164.132.170.199', 25518, '127.0.0.1', 10337);

relay.insert(re);

// relay.delete(25518)


// re.start();

// 25518