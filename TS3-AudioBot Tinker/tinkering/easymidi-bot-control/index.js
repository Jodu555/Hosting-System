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

const controle = (msg) => {
    if (msg._type == 'noteon' && msg.channel == 9) {
        if (msg.note == 46)
            bot.getPlayer().pause();
        if (msg.note == 42)
            bot.getPlayer().play();
        if (msg.note == 41)
            bot.getPlayer().seek(11);
        if (msg.note == 49)
            bot.getPlayer().seek(95);
    }

    if ((msg._type == 'cc' || msg._type == 'pitch') && (msg.controller == 23 || msg.controller == 49 || msg.controller == undefined)) {
        let top = msg.controller == undefined ? 16383 : 127;
        // if (msg.controller == undefined) {
        //     console.log(msg);
        //     const value = Math.round(map(msg.value, 0, 16383, 0, 100));
        // } else {

        // }
        const value = Math.round(map(msg.value, 0, top, 0, 100));
        // console.log(value);
        changeVolume(value);

    } else {
        console.log(msg._type, msg);
    }
}

inputs.forEach(name => {
    const input = new easymidi.Input(name);
    input.on('noteon', controle);
    input.on('pitch', controle)
    input.on('cc', controle);
});

const changeVolume = throttle((value) => {
    console.log('Want to change value!');
    bot.getPlayer().changeVolume(value);
}, 50);

function debounce(cb, delay = 1000) {
    let timeout

    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            cb(...args)
        }, delay)
    }
}

function throttle(cb, delay = 1000) {
    let shouldWait = false
    let waitingArgs
    const timeoutFunc = () => {
        if (waitingArgs == null) {
            shouldWait = false
        } else {
            cb(...waitingArgs)
            waitingArgs = null
            setTimeout(timeoutFunc, delay)
        }
    }

    return (...args) => {
        if (shouldWait) {
            waitingArgs = args
            return
        }

        cb(...args)
        shouldWait = true

        setTimeout(timeoutFunc, delay)
    }
}






console.log(inputs, outputs);