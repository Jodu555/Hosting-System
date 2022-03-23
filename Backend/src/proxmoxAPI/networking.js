//const fetch = require('node-fetch');
const axios = require('axios');
const https = require('https');
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});


async function get(url, headers) {
    try {
        const response = await axios.get(url, { httpsAgent, headers })
        return response;
    } catch (error) {
        console.log(error, url, headers);
    }
}

async function post(url, data, headers = {}) {
    try {
        const response = await axios.post(url, data, {
            httpsAgent,
            headers,
        })
        return response;
    } catch (error) {
        console.log(error, url, data, headers);
    }
}

async function put(url, data, headers = {}) {
    try {
        const response = await axios.put(url, data, {
            httpsAgent,
            headers
        })
        return response;
    } catch (error) {
        console.log(error, url, data, headers);
    }
}

async function del(url, headers = {}) {
    try {
        const response = await axios.delete(url, {
            httpsAgent,
            headers
        });
        return response;
    } catch (error) {
        console.log(error, url, headers);
    }
}

module.exports = {
    get,
    post,
    put,
    del
}