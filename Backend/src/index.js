const ProxmoxAPI = require('./proxmoxAPI/ProxmoxAPI')
const dotenv = require('dotenv').config();
const { NodeSSH } = require('node-ssh')


async function run() {

    // const ssh = new NodeSSH()

    // ssh.connect({
    //     host: '103.158.223.126',
    //     username: 'root',
    //     password: process.env.DEFAULT_ROOT_PASSWORD
    // }).then(() => {
    //     ssh.putFile('test.txt', '/etc/network/test.txt').then(() => {
    //         console.log("The File thing is done")
    //     }, function (error) {
    //         console.log("Something's wrong")
    //         console.log(error)
    //     })
    // });


    // return;
    const proxmoxAPI = new ProxmoxAPI(process.env.URL + '/api2/json', {
        username: 'root@pam',
        password: process.env.PASSWORD
    })

    await proxmoxAPI.authenticate();

    const node = proxmoxAPI.getNode('ns3177623');

    // node.getVM('100').resize({ size: '5G' })

    console.log(await node.getVM(101).status.current());
    console.log(await node.getVM(100).status.start());


    // console.log(await node.information());

    // const template = node.getVM(100);
    // await template.clone({
    //     newid: 101,
    //     full: true // So the storage is independent
    // });

    // const newVM = node.getVM(101);
    // await newVM.configurate({
    //     name: 'Test-API',
    //     // ide2: 'local:iso/debian-10.11.0-amd64-netinst.iso',
    //     cores: 4,
    //     sockets: 4,
    //     memory: 6024,
    //     net0: 'virtio=02:00:00:01:c6:6b,bridge=vmbr0,firewall=1',
    //     // scsi0: 'local:32,format=qcow2'
    // })
    // await newVM.configurate({
    //     scsi0: 'local:32,format=qcow2'
    // })

    // console.log(await proxmoxAPI.getNodeInformation('ns3177623'));

    // const newVM = node.getVM(100);
    // await newVM.create({
    //     name: 'D10-Temp',
    //     vmid: 100,
    //     ide2: 'local:iso/debian-10.11.0-amd64-netinst.iso,media=cdrom',
    //     cores: 2,
    //     sockets: 2,
    //     memory: 4048,
    //     net0: 'virtio=02:00:00:01:c6:6b,bridge=vmbr0,firewall=1',
    //     scsi0: 'local:3,format=qcow2'
    // });


}

// curl -k -d  https://51.195.60.60:8006/api2/json/access/ticket

run();