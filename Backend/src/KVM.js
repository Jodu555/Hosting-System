const fs = require('fs');
const path = require('path');
const { NodeSSH } = require('node-ssh')


const defaultNetworkConfig = path.join(process.cwd(), 'work', 'network-template.txt');

class KVM {
    /**
     * @param  {Number} ID
     * @param  {Object} network
     * @param  {Object} specs
     */
    constructor(ID, network, specs) {
        this.ID = ID;
        this.network = {
            ip: network.ip ?? '127.0.0.1',
            mac: network.mac ?? 'DEFAULT_MAC',
            gateway: network.gateway ?? 'DEFAULT_GATEWAY',
            netmask: network.netmask ?? '255.255.255.255',
            config: path.join(process.cwd(), 'work', `network-config-${this.ID}.txt`)
        };
        this.specs = specs;
    }

    async create() {
        // Step 1: Clone the template
        // Step 2: Configure the new vm
        this.prepareFile();
        const status = await this.uploadFile();
        // Step 4: TODO: Change password
    }

    async uploadFile() {
        const ssh = new NodeSSH()
        await ssh.connect({
            host: this.network.ip,
            username: 'root',
            password: process.env.DEFAULT_ROOT_PASSWORD
        });
        let failed = false;
        await this.ssh.putFile(this.network.config, '/etc/network/interfaces').then(() => {
            failed = false;
        }, (error) => {
            failed = true;
        });
        return failed;
    }

    //Rewirtes the file and passes in the params
    prepareFile() {
        let data = fs.readFileSync(defaultNetworkConfig, 'utf-8');
        data = data.replaceAll('<ADDRESS>', this.network.ip);
        data = data.replaceAll('<GATEWAY>', this.network.gateway);
        data = data.replaceAll('<NETMASK>', this.network.netmask);
        fs.writeFileSync(this.network.config, data, 'utf8');
    }
}

module.exports = KVM;