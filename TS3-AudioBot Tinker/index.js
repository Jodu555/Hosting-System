require('dotenv').config();
const axios = require('axios');
const API_URL = process.env.API_URL + '/api';

async function createNewBot(name, address, autoplay) {
    await call(`/settings/copy/default/${name}`);
    await call(`/settings/bot/set/${name}/connect.identity.key/`);
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

createNewBot('apifinn');
