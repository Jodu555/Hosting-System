const ProxmoxAPI = require('./ProxmoxAPI')
const dotenv = require('dotenv').config();


async function run() {
    const proxmoxAPI = new ProxmoxAPI('https://51.195.60.60:8006/api2/json', {
        username: 'root@pam',
        password: process.env.PASSWORD
    })

    await proxmoxAPI.authenticate();

    console.log(await proxmoxAPI.getNodeInformation('ns3177623'));

}

// curl -k -d  https://51.195.60.60:8006/api2/json/access/ticket

run();