const fs = require('fs');
const path = require('path');
const { NodeSSH } = require('node-ssh')

const defaultNetworkConfig = path.join(process.cwd(), 'work', 'network-template.txt');

const wait = ms => new Promise((resolve, reject) => setTimeout(() => { resolve() }, ms));

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
        console.log(1);
        const template = this.node.getVM(100);
        await template.clone({
            newid: Number(this.ID),
            full: true // So the storage is independent
        });

        // Step 2: Configure the new vm
        console.log(2);
        const newVM = this.node.getVM(Number(this.ID));
        await newVM.configurate({
            name: `API-${this.ID}`,
            cores: this.specs.cores,
            sockets: this.specs.sockets,
            memory: this.specs.memory,
            net0: `virtio=${process.env.DEFAULT_MAC_ADDRESS},bridge=vmbr0,firewall=1`,
        })

        // Step 3: Start the VM
        console.log(3);
        newVM.status.start();
        await wait(20000);

        // Step 4: Prepare File
        console.log(4);
        this.prepareFile();
        const status = await this.uploadFile();
        console.log(status);

        // Step 5: Configure the mac address
        console.log(5);
        await newVM.configurate({
            net0: `virtio=${this.network.mac},bridge=vmbr0,firewall=1`,
        })

        // Step 6: Reboot VM cause network config change
        console.log(6);
        newVM.status.reboot();

        // Step 6: TODO: Change password
    }

    async uploadFile() {
        const ssh = new NodeSSH()
        const connectionDetails = {
            host: process.env.DEFAULT_IP_ADDRESS,
            username: 'root',
            password: process.env.DEFAULT_ROOT_PASSWORD
        }
        console.log(connectionDetails);
        await ssh.connect(connectionDetails);
        let failed = false;

        await this.ssh.putFiles([{ local: this.network.config, remote: '/etc/network/interfaces' }]).then(() => {
            failed = false;
        }, (error) => {
            failed = true;
        });
        ssh.dispose();
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