const Relay = require('./src/Relay');
const RelayEntity = require('./src/RelayEntity');

// new RelayEntity('THE internal IP the server has', the internal port the server has, 'the external ip the relay has', the external port the relay has);


const relay = new Relay();
const re = new RelayEntity('164.132.170.199', 25518, '127.0.0.1', 10337);
relay.insert(re);

// const str = 'Hallo123 ich bin cool';
// console.log(Buffer.from(str), Buffer.from(str));
