const fetch = require('node-fetch');
const https = require('https');
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});


async function get(url, headers) {
    const response = await fetch(url, {
        method: 'GET',
        headers,
        agent: httpsAgent,
    });
    return response;
}

async function post(url, data, headers = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        agent: httpsAgent,
    });
    return response;
}

module.exports = {
    get,
    post
}