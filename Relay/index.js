const net = require('net');
const { off } = require('process');
const Packet = require('./Packet');
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
        this.debug = false;
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
            this.debug && console.log('Catched');
        }
        // const mc = require('minecraft-protocol');
        // const states = mc.states;
        // const mcData = require('minecraft-data')('1.8.8');
        // const version = mcData.version;

        // const des = mc.createDeserializer({ state: states.HANDSHAKING, isServer: true, version: '1.8.8' });
        this.server = net.createServer((input) => {
            try {
                this.debug && console.log('Relay got connection');

                const output = new net.Socket();
                output.connect(this.intPort, this.intIP, () => {
                    console.log('Relay Established Handshake');
                });

                output.on('data', (svdata) => {
                    //Packets from Server
                    // console.log('INFO SR: ' + svdata.toString());

                    const json = deserializeStatusAndCheck(svdata);
                    json && console.log(json);
                    input.write(svdata);
                });

                input.on('data', (cldata) => {
                    //Packets from Client
                    // console.log('INFO CL: ' + cldata.toString());

                    output.write(cldata);
                });

                input.on('close', () => {
                    this.debug && console.log('Relay got Input closed');
                    output.end();
                });
                output.on('close', () => {
                    this.debug && console.log('Relay got Output closed');
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
const convert = (str, from, to) => Buffer.from(str, from).toString(to);

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

const deserializeStatusAndCheck = (svdata) => {
    if (!svdata.toString().includes('{"description"')) return;
    let response = Buffer.alloc(0);
    let streamLength = [];
    let offset = 0;
    let json = null;
    if (response.byteLength == 0) {
        let packet = new Packet(svdata);
        streamLength = packet.readVarIntL(); //read prepended varint for streamlength
        let jsonLength = packet.readVarIntLAt(streamLength[1] + 1); //json string bytelength
        offset = streamLength[1] + jsonLength[1] + 1; //1 byte packet id, data length, data string bytelength
    }

    response = Buffer.concat([response, svdata]);

    if (response.byteLength == (streamLength[0] + streamLength[1])) {
        response = response.slice(offset);

        try {
            json = JSON.parse(response.toString('utf-8'));
        } catch (err) {
            console.log('JSON parse error: Server sent unexpected data.');
        }

        if (json?.version?.name == 'TCPShield.com') {
            console.log('Server is running behind TCPShield.');
        }
    }
    return json;
}


// new RelayEntity('THE internal IP the server has', the internal port the server has, 'the external ip the relay has', the external port the relay has);

const relay = new Relay();
const re = new RelayEntity('164.132.170.199', 25518, '127.0.0.1', 10337);
relay.insert(re);

// const str = 'Hallo123 ich bin cool';
// console.log(Buffer.from(str), Buffer.from(str));
