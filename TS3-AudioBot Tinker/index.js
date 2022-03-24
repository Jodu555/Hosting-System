require('dotenv').config();
const axios = require('axios');
const API_URL = process.env.API_URL + '/api';

const encUri = u => encodeURIComponent(u);

async function createNewBot(name, address, autoplayUrl = '', defaultChannel = null) {

    const nameValidation = /(?![a-zA-Z0-9_-])./gm;

    constSafeName = name.replace(nameValidation, '');

    await call(`/settings/copy/default/${constSafeName}`);
    //Change the bot settings!
    await call(`/settings/bot/set/${constSafeName}/connect.address/${address}`);
    await call(`/settings/bot/set/${constSafeName}/connect.name/${name}`);
    if (defaultChannel != null)
        await call(`/settings/bot/set/${constSafeName}/connect.channel/${encUri(`/${defaultChannel}`)}`);

    await call(`/settings/bot/set/${constSafeName}/events.onconnect/!play ${autoplayUrl}`);
    await call(`/settings/bot/set/${constSafeName}/connect.identity.key/`);

    // Reloaded the settings & Bot Connection

    await call(`/settings/bot/reload/${constSafeName}`);
    await call(`/bot/connect/template/${constSafeName}`);
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
    'Jodu\'s Bot': ['https://m4a-64.jango.com/44/03/98/4403985957274169186.m4a', 9]
    // 'BB-Radio': ['http://irmedia.streamabc.net/irm-bbradiolive-mp3-128-4531502', 38],
    // 'SpreeRadio': ['https://stream.spreeradio.de/spree-live/mp3-256/konsole/', 39],
    // 'RTL': ['http://stream.104.6rtl.com/rtl-live/mp3-192/radio-browser.info/', 40],
    // 'Energy': ['http://cdn.nrjaudio.fm/adwz1/de/33019/mp3_128.mp3', 41],
    // 'KissFM': ['https://topradio-de-hz-fal-stream03-cluster01.radiohost.de/kissfm_128', 42],
    // 'JamFM': ['http://stream.jam.fm/jamfm-live/mp3-192/tunein', 43]
};

Object.entries(RadioBots).forEach(([name, [stream, channel]]) => {
    console.log(name, stream, channel);
    createNewBot(name, '178.254.35.43', encUri(stream), channel);
});

