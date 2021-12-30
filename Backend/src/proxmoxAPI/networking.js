const fetch = require('node-fetch');
const axios = require('axios');
const https = require('https');
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});


async function get(url, headers) {
    // const response = await fetch(url, {
    //     method: 'GET',
    //     headers,
    //     agent: httpsAgent,
    // });
    const response = await axios.get(url, { httpsAgent, headers })
    return response;
}

async function post(url, data, headers = {}) {
    // const response = await fetch(url, {
    //     method: 'POST',
    //     headers: {
    //         ...headers,
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data),
    //     agent: httpsAgent,
    // });
    const response = await axios.post(url, data, {
        httpsAgent,
        headers,
    })
    return response;
}

async function put(url, data, headers = {}) {
    // const response = await fetch(url, {
    //     method: 'PUT',
    //     headers: {
    //         ...headers,
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data),
    //     agent: httpsAgent,
    // });
    const response = await axios.put(url, data, {
        httpsAgent,
        headers
    })
    return response;
}

async function del(url, headers = {}) {
    const response = await fetch(url, {
        method: 'DELETE',
        headers,
        agent: httpsAgent,
    });
    return response;
}

module.exports = {
    get,
    post,
    put,
    del
}