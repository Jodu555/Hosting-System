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

        const zlib = require('zlib');
        this.server = net.createServer((input) => {
            try {
                this.debug && console.log('Relay got connection');

                const output = new net.Socket();
                output.connect(this.intPort, this.intIP, () => {
                    console.log('Relay Established Handshake');
                });

                var response = Buffer.alloc(0);
                var streamLength = [];
                var offset = 0;

                output.on('data', (svdata) => {
                    let json = null;
                    if (response.byteLength == 0) {
                        let packet = new Packet(svdata);
                        streamLength = packet.readVarIntL(); //read prepended varint for streamlength
                        let jsonLength = packet.readVarIntLAt(streamLength[1] + 1); //json string bytelength
                        offset = streamLength[1] + jsonLength[1] + 1; //1 byte packet id, data length, data string bytelength
                        console.log(streamLength, jsonLength, offset);
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
                        console.log(this.extIP, json);
                    }
                    //Packets from Server
                    // console.log('Packet from Server', svdata.toString());
                    // if (svdata.toString().includes('{"description"')) {

                    //     const packet = new Packet(svdata);

                    // console.log(des.parsePacketBuffer(svdata));

                    // const des = new ServerStatusDes(svdata);

                    // console.log({ 1: svdata.toString(), 2: des.build(), 3: Buffer.from(des.build(), 'hex'), 4: svdata });
                    // input.write(Buffer.from(des.build(), 'hex'));
                    // return;

                    // // input.write(Buffer.from(des.build(), 'utf-8'));
                    // // return;
                    // console.log(123);
                    // }
                    const out = new Packet()
                    out.writeVarInt(0x00);
                    out.writeString(JSON.stringify({ ...json, description: 'A Relay Server' }))
                    // out.sign();
                    input.write(out.get());
                    // input.write(svdata);
                });

                input.on('data', (cldata) => {
                    console.log('INFO: ' + cldata.toString());
                    //Packets from Client
                    // console.log('Packet from Client', cldata.toString());
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

function toHexString(byteArray) {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

class ServerStatusDes {
    constructor(buffer) {
        const data = Buffer.from(buffer.toString('hex'), 'hex').toString('utf-8');

        // console.log(Buffer.compare(buffer, Buffer.from(data, 'binary')), buffer, Buffer.from(data, 'binary'));
        this.newJson = {
            description: 'A Relay Server',
            players: { max: 20, online: 1, sample: [] },
            version: { name: 'Spigot 1.8.8', protocol: 47 }
        }
        this.ogData = data;
        this.data = data;
        // this.strip();
    }
    strip() {
        //Strip the json data out
        this.data = this.data.substring(5);
        try {
            this.json = JSON.parse(this.data);
            this.ogJson = this.json;
        } catch (error) {
        }
    }

    build() {
        //Build the out packet
        console.log(this.ogData, this.ogData.replace(JSON.stringify(this.ogJson), JSON.stringify(this.newJson)));
        return this.ogData.replace(JSON.stringify(this.ogJson), JSON.stringify(this.newJson));
    }
}


// new RelayEntity('THE internal IP the server has', the internal port the server has, 'the external ip the relay has', the external port the relay has);

const relay = new Relay();
const re = new RelayEntity('164.132.170.199', 25518, '127.0.0.1', 10337);
relay.insert(re);

// const str = 'Hallo123 ich bin cool';
// console.log(Buffer.from(str), Buffer.from(str));
