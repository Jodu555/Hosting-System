const fetch = require('node-fetch');

const URL = 'http://51.195.60.60:8006/api2/json'

async function run() {
    const response = await fetch(URL + '/access/ticket', {
        method: 'POST',
        body: JSON.stringify({
            username: 'root@pam',
            password: '8952464b73e9021544e7b6297abb74bf'
        })
    });
    console.log(response);
}

// curl -k -d  https://51.195.60.60:8006/api2/json/access/ticket

run();