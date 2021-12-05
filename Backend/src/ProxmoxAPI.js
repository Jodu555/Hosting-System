const fetch = require('node-fetch');
const https = require('https');
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

    async getNodeInformation(node) {
        const response = await get(this.URL + '/nodes/' + node + '/status', {
            cookie: `PVEAuthCookie=${this.auth.data.ticket};`
        });
        console.log(response);
        return await response.json();
    }

    async createVM(data) {
        const response = await post(this.URL + '/nodes/ns3177623/qemu', data, {
            cookie: `PVEAuthCookie=${this.auth.data.ticket};`,
            CSRFPreventionToken: this.auth.data.CSRFPreventionToken,
        });
        console.log(response);
        // console.log(await response.text());
        console.log(await response.json());
    }

    async cloneVM(data) {
        const response = await post(this.URL + `/nodes/ns3177623/qemu/${data.vmid}/clone`, data, {
            cookie: `PVEAuthCookie=${this.auth.data.ticket};`,
            CSRFPreventionToken: this.auth.data.CSRFPreventionToken,
        });
        console.log(response);
        // console.log(await response.text());
        console.log(await response.json());
    }

    async configurate(ID, data) {
        const response = await post(this.URL + `/nodes/ns3177623/qemu/${ID}/config`, data, {
            cookie: `PVEAuthCookie=${this.auth.data.ticket};`,
            CSRFPreventionToken: this.auth.data.CSRFPreventionToken,
        });
        console.log(response);
        console.log(await response.json());
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