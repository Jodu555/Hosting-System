require('dotenv').config();
const axios = require('axios');
const API_URL = process.env.API_URL + '/api';

const { CommandManager, Command } = require('@jodu555/commandmanager');
const TS3Audiobot = require('./TS3Audiobot');
//                                              Pass here the standard pipe you want to use
const commandManager = CommandManager.createCommandManager(process.stdin, process.stdout);

const authenticationObject = {
    API_URL: process.env.API_URL + '/api',
    USERNAME: process.env.API_USERNAME,
    TOKEN: process.env.API_TOKEN
};



commandManager.registerCommand(new Command(['reload', 'rl'], 'reload <name>', 'Reloads a bot by his name!', (command, [...args], scope) => {
    console.log(args.length);
    if (args.length != 1) {
        return 'Please provide the bot name you wanna reload!';
    }
    const name = args[1];
    console.log('Reload Bot: ' + name);
}));
//TODO: Commands: [reload, create]

//TODO: Create a class instance wrapper

const wait = (ms) => new Promise((resolve, _) => setTimeout(() => resolve(), ms));


//TODO: Figure out how to implement and add the rights system

async function createNewBot(name, address, autoplayUrl = '', defaultChannel = null) {

    const nameValidation = /(?![a-zA-Z0-9_-])./gm;

    const saveName = name.replace(nameValidation, '');

    await call(`/settings/copy/default/${saveName}`);
    await wait(500);
    //Change the bot settings!
    await call(`/settings/bot/set/${saveName}/connect.address/${encUri(address)}`);
    await call(`/settings/bot/set/${saveName}/connect.name/${encUri(name)}`);
    if (defaultChannel != null)
        await call(`/settings/bot/set/${saveName}/connect.channel/${encUri(`/${defaultChannel}`)}`);

    await call(`/settings/bot/set/${saveName}/events.onconnect/!play ${encUri(autoplayUrl)}`);
    await call(`/settings/bot/set/${saveName}/connect.identity.key/`);
    await wait(1000);

    // Reloaded the settings & Bot Connection

    await call(`/settings/bot/reload/${saveName}`);
    await call(`/bot/connect/template/${saveName}`);
    console.log('Finished');
}

async function call(url = '') {
    url = API_URL + url;
    try {
        const authStr = btoa(`${process.env.API_USERNAME}:${process.env.API_TOKEN}`);
        const response = await axios.get(url, {
            headers: { 'Authorization': `Basic ${authStr}` }
        });
        console.log({ status: response.status, data: response.data });
    } catch (error) {
        console.error('Got Call error', url, error);
    }
}

const RadioBots = {
    'Jodu\'s Bot': ['https://m4a-64.jango.com/44/03/98/4403985957274169186.m4a', 9],
    'BB-Radio': ['http://irmedia.streamabc.net/irm-bbradiolive-mp3-128-4531502', 38],
    'SpreeRadio': ['https://stream.spreeradio.de/spree-live/mp3-256/konsole/', 39],
    'RTL': ['http://stream.104.6rtl.com/rtl-live/mp3-192/radio-browser.info/', 40],
    'Energy': ['http://cdn.nrjaudio.fm/adwz1/de/33019/mp3_128.mp3', 41],
    'KissFM': ['https://topradio-de-hz-fal-stream03-cluster01.radiohost.de/kissfm_128', 42],
    'JamFM': ['http://stream.jam.fm/jamfm-live/mp3-192/tunein', 43]
};




(async () => {

    const bot = new TS3Audiobot(
        authenticationObject,
        'TEST'
    );

    // for (const [name, [stream, channel]] of Object.entries(RadioBots)) {
    //     await wait(1000);
    //     console.log(name, stream, channel);
    //     await createNewBot(name, 'ts.jodu555.de', stream, channel);
    // }
})();


