const fs = require('fs');
const { NodeSSH } = require('node-ssh')

const defaultNetworkConfig = process.cwd() + '/work/network-template.txt';

class KVM {
    constructor(ID, ip, mac, gateway, netmask) {
        this.ID = ID;
        this.ip = ip;
        this.mac = mac;
        this.gateway = gateway;
        this.netmask = netmask || '255.255.255.255';
        this.networkConfig = process.cwd() + '/work/network-config-' + this.ID + '.txt';
    }

    prepareFile() {
        //Step 1: Rewirte the file and pass in the params
        let data = fs.readFileSync(defaultNetworkConfig, 'utf-8');
        data = data.replaceAll('<ADDRESS>', this.ip);
        data = data.replaceAll('<GATEWAY>', this.gateway);
        data = data.replaceAll('<NETMASK>', this.netmask);
        fs.writeFileSync(this.networkConfig, data, 'utf8');

        return;
        //Step 2: Upload the file via SSH
        const ssh = new NodeSSH()
        ssh.connect({
            host: this.ip,
            username: 'root',
            password: process.env.DEFAULT_ROOT_PASSWORD
        }).then(() => {
            ssh.putFile(this.networkConfig, '/etc/network/interfaces.d').then(() => {
                console.log("The File thing is done")
            }, function (error) {
                console.log("Something's wrong")
                console.log(error)
            })
        });


    }
}

module.exports = KVM;