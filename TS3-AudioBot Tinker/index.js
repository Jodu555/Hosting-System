require('dotenv').config();
const axios = require('axios');
const API_URL = process.env.API_URL + '/api';

const createNewBot = (name, address, autoplay) => {
    call(`/settings/copy/default/${name}`)
}



async function call(url = '') {
    try {
        const authStr = btoa(`${process.env.API_USERNAME}:${process.env.API_TOKEN}`);
        const response = await axios.get(API_URL + url, {
            headers: { 'Authorization': `Basic ${authStr}` }
        });
        console.log(response.status);
    } catch (error) {
        console.error('Got Call error', url, error);
    }
}

call()
