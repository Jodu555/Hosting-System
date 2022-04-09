const easymidi = require('easymidi');
const dotenv = require('dotenv').config();

const TS3Audiobot = require('../../src/TS3Audiobot');

const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;

const inputs = easymidi.getInputs();
const outputs = easymidi.getOutputs();

const authenticationObject = {
    API_URL: process.env.API_URL + '/api',
    USERNAME: process.env.API_USERNAME,
    TOKEN: process.env.API_TOKEN
};

const bot = new TS3Audiobot(
    authenticationObject,
    'TEST'
);

console.log(bot);

inputs.forEach(name => {
    const input = new easymidi.Input(name);
    input.on('noteon', (msg) => {
        console.log(name, 'noteon', msg);
    });
    input.on('cc', (msg) => {
        // console.log(name, 'cc', msg);
        const value = Math.round(map(msg.value, 0, 127, 0, 100));
        bot.pm(301, value)
    });
});






console.log(inputs, outputs);