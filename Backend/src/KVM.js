const fs = require('fs');
const { NodeSSH } = require('node-ssh')

const defaultNetworkConfig = process.cwd() + '/work/network-template.txt';

class KVM {

    constructor(ID, network, specs) {
        this.ID = ID;
        this.network = {
            ip: network.ip ?? '127.0.0.1',
            mac: network.mac ?? 'DEFAULT_MAC',
            gateway: network.gateway ?? 'DEFAULT_GATEWAY',
            netmask: network.netmask ?? '255.255.255.255',
            config: process.cwd() + '/work/network-config-' + this.ID + '.txt'
        };
        this.specs = specs;
    }

    create() {

    }

    prepareFile() {

        //Step 1: Rewirte the file and pass in the params
        let data = fs.readFileSync(defaultNetworkConfig, 'utf-8');
        data = data.replaceAll('<ADDRESS>', this.network.ip);
        data = data.replaceAll('<GATEWAY>', this.network.gateway);
        data = data.replaceAll('<NETMASK>', this.network.netmask);
        fs.writeFileSync(this.network.config, data, 'utf8');

        return;
        //Step 2: Upload the file via SSH
        const ssh = new NodeSSH()
        ssh.connect({
            host: this.network.ip,
            username: 'root',
            password: process.env.DEFAULT_ROOT_PASSWORD
        }).then(() => {
            ssh.putFile(this.network.config, '/etc/network/interfaces').then(() => {
                console.log("The File thing is done")
            }, function (error) {
                console.log("Something's wrong")
                console.log(error)
            })
        });


    }
}

module.exports = KVM;