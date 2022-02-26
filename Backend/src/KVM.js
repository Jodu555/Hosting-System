const fs = require('fs');
const path = require('path');
const { NodeSSH } = require('node-ssh')

const defaultNetworkConfig = path.join(process.cwd(), 'work', 'network-template.txt');

class KVM {
    /**
     * @param  {Number} ID
     * @param  {Object} network
     * @param  {String} network.ip
     * @param  {String} network.mac
     * @param  {String} network.gateway
     * @param  {String} network.netmask
     * @param  {Object} specs
     * @param  {Number} specs.cores
     * @param  {Number} specs.sockets
     * @param  {Number} specs.memory
     * @param  {Number} specs.disk
     */
    constructor(ID, network, specs, node) {
        this.ID = ID;
        this.network = {
            ip: network.ip ?? '127.0.0.1',
            mac: network.mac ?? 'DEFAULT_MAC',
            gateway: network.gateway ?? 'DEFAULT_GATEWAY',
            netmask: network.netmask ?? '255.255.255.255',
            config: path.join(process.cwd(), 'work', `network-config-${this.ID}.txt`)
        };
        this.specs = specs;
        this.node = node;
    }

    async create() {
        console.log(this);
        // Step 1: Clone the template
        const template = this.node.getVM(100);
        console.log(3);
        await template.clone({
            newid: Number(this.ID),
            full: true // So the storage is independent
        });
        // Step 2: Configure the new vm
        const newVM = this.node.getVM(Number(this.ID));
        console.log(4);
        await newVM.configurate({
            name: `API-${this.ID}`,
            cores: this.specs.cores,
            sockets: this.specs.sockets,
            memory: this.specs.memory,
            net0: `virtio=${this.network.mac},bridge=vmbr0,firewall=1`,
            scsi0: `local:${this.specs.disk},format=qcow2`
        })
        // Step 3: Prepare File
        this.prepareFile();
        console.log(5);
        const status = await this.uploadFile();
        console.log(status);
        // Step 4: TODO: Change password
    }

    async uploadFile() {
        const ssh = new NodeSSH()
        await ssh.connect({
            host: process.env.DEFAULT_IP_ADDRESS,
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