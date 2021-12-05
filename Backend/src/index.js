const ProxmoxAPI = require('./ProxmoxAPI')
const dotenv = require('dotenv').config();


async function run() {
    const proxmoxAPI = new ProxmoxAPI(process.env.URL + '/api2/json', {
        username: 'root@pam',
        password: process.env.PASSWORD
    })

    await proxmoxAPI.authenticate();

    // console.log(await proxmoxAPI.getNodeInformation('ns3177623'));

    // await proxmoxAPI.createVM({
    //     node: 'ns3177623',
    //     name: 'Test',
    //     vmid: 100,
    //     ide2: 'local:iso/debian-10.11.0-amd64-netinst.iso',
    //     cores: 2,
    //     sockets: 2,
    //     memory: 4048,
    //     net0: 'virtio=02:00:00:01:c6:6b,bridge=vmbr0,firewall=1',
    //     scsi0: 'local:32,format=qcow2'
    // });

    // await proxmoxAPI.cloneVM({
    //     vmid: 100,
    //     newid: 103
    // })

    // await proxmoxAPI.configurate(103, {
    //     name: 'Test-API',
    //     ide2: 'local:iso/debian-10.11.0-amd64-netinst.iso',
    //     cores: 3,
    //     sockets: 3,
    //     memory: 5024,
    //     net0: 'virtio=02:00:00:01:c6:6b,bridge=vmbr0,firewall=1',
    //     scsi0: 'local:32,format=qcow2'
    // })


}

// curl -k -d  https://51.195.60.60:8006/api2/json/access/ticket

run();