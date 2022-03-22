require('dotenv').config();
const axios = require('axios');
const API_URL = process.env.API_URL + '/api';

async function createNewBot(name, address, autoplayUrl = '', defaultChannel = null) {
    await call(`/settings/copy/default/${name}`);
    //Change the bot settings!
    await call(`/settings/bot/set/${name}/connect.address/${address}`);
    await call(`/settings/bot/set/${name}/connect.name/${name}`);
    if (defaultChannel != null)
        await call(`/settings/bot/set/${name}/connect.channel/${encUri(`/${defaultChannel}`)}`);

    await call(`/settings/bot/set/${name}/events.onconnect/!play ${autoplayUrl}`);
    await call(`/settings/bot/set/${name}/connect.identity.key/`);

    //Reloaded the settings & Bot Connection

    await call(`/settings/bot/reload/${name}`);
    await call(`/bot/connect/template/${name}`);
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
    'SpreeRadio': 'https://stream.spreeradio.de/spree-live/mp3-256/konsole/',
    'RTL': 'http://stream.104.6rtl.com/rtl-live/mp3-192/radio-browser.info/',
    'Energy': 'http://cdn.nrjaudio.fm/adwz1/de/33019/mp3_128.mp3',
    'KissFM': '',
    'JamFM': ''
};

Object.entries(RadioBots).forEach(([k, v]) => {
    console.log(k, v);
    createNewBot(k, 'rooti.jodu555.de', encUri(v));
});

const encUri = u => encodeURIComponent(u);
