const fetch = require('node-fetch');
const https = require('https');

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

const URL = 'https://51.195.60.60:8006/api2/json'

async function run() {
    const token = await authenticate();
    const response = await fetch(URL, {
        method: 'GET',
        headers: {
            cookie: `PVEAuthCookie=${token.data.ticket};`
        },
        agent: httpsAgent,
    });
    console.log(token);
    console.log(response);
}

async function authenticate() {
    const response = await fetch(URL + '/access/ticket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: 'root@pam',
            password: '8952464b73e9021544e7b6297abb74bf'
        }),
        agent: httpsAgent,
    });
    return await response.json();
}

// curl -k -d  https://51.195.60.60:8006/api2/json/access/ticket

run();