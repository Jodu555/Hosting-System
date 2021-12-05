const ProxmoxAPI = require('./ProxmoxAPI')


async function run() {
    const proxmoxAPI = new ProxmoxAPI('https://51.195.60.60:8006/api2/json', {
        username: 'root@pam',
        password: '8952464b73e9021544e7b6297abb74bf'
    })


    const token = await authenticate();

    // console.log(token);
    console.log(await response.json());
}

async function authenticate() {

}

// curl -k -d  https://51.195.60.60:8006/api2/json/access/ticket

run();