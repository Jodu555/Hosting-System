const fetch = require('node-fetch');
const https = require('https');
const VM = require('./VM');
const Node = require('./Node');
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

class ProxmoxApi {
    constructor(URL, credentials) {
        this.URL = URL;
        this.credentials = credentials;
    }

    async authenticate() {
        const response = await post(this.URL + '/access/ticket', this.credentials)
        this.auth = await response.json();
    }

    getNode(ID) {
        return new Node(this, ID)
    }

}

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

module.exports = ProxmoxApi