const fs = require('fs');
const path = require('path');
const { NodeSSH } = require('node-ssh');
const { generatePassword } = require('../utils/crypt');

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
        console.log('KVM Creation: ', this);
        console.log(1);
        await this._clone(); // Step 1: Clone the template
        console.log(2);
        const newVM = await this._configure(); // Step 2: Configure the new vm
        console.log(3);
        newVM.status.start(); // Step 3: Start the VM
        console.log(4);
        await wait(10000); // Step 4: Wait for the Vm to spin up
        console.log(5);
        this.prepareFile();  // Step 5: Prepare File
        console.log(6);
        await this.uploadFile(); // Step 6: Upload File
        console.log(7);
        await this._configureMac(newVM)  // Step 7: Configure the mac address
        console.log(8);
        await newVM.status.start(); // Step 8: Start the VM
        console.log(9);
        this.deleteFile(); // Step 9: Delete the network file
        console.log(10);

        // Step 10: TODO: Change password
        const password = await generatePassword();
        console.log(`password`, password);
        this.changePassword(password);
        // HINT: To Change the password just run "echo 'root:145' | sudo chpasswd"
    }

    //Vm Handling Stuff
    async _clone() {
        const template = this.node.getVM(100);
        await template.clone({
            newid: Number(this.ID),
            full: true // So the storage is independent
        });
    }
    async _configure() {
        const newVM = this.node.getVM(Number(this.ID));
        await newVM.configurate({
            name: `API-${this.ID}`,
            cores: this.specs.cores,
            sockets: this.specs.sockets,
            memory: this.specs.memory,
            net0: `virtio=${process.env.DEFAULT_MAC_ADDRESS},bridge=vmbr0,firewall=1`,
        })
        return newVM;
    }
    async _configureMac(newVM) {
        await newVM.configurate({
            net0: `virtio=${this.network.mac},bridge=vmbr0,firewall=1`,
        })
    }

    async changePassword(password) {
        const ssh = await this.connectToServer({
            host: this.network.ip,
            password: process.env.DEFAULT_ROOT_PASSWORD,
        });
        let result = await ssh.execCommand(`echo 'root:${password}' | sudo chpasswd`);
        console.log(result);
        await wait(1200);
        result = await ssh.execCommand(`reboot`);
        console.log(result);
        console.log('Password Changed');

    }

    async connectToServer(opts) {
        const ssh = new NodeSSH()
        const connectionDetails = { ...{ username: 'root' }, ...opts };
        console.log('Connection Details: ', connectionDetails);
        await ssh.connect(connectionDetails);
        return ssh;
    }

    //File Hanling Stuff
    async uploadFile() {
        const ssh = await this.connectToServer({
            host: process.env.DEFAULT_IP_ADDRESS,
            password: process.env.DEFAULT_ROOT_PASSWORD
        });
        let failed = false;
        await ssh.putFiles([{ local: this.network.config, remote: '/etc/network/interfaces' }]).then(() => {
            failed = false;
        }, (error) => {
            console.log('VM Network file upload failed:', error);
            failed = true;
        });
        ssh.dispose();
        return failed;
    }
    prepareFile() {
        let data = fs.readFileSync(defaultNetworkConfig, 'utf-8');
        data = data.replaceAll('<ADDRESS>', this.network.ip);
        data = data.replaceAll('<GATEWAY>', this.network.gateway);
        data = data.replaceAll('<NETMASK>', this.network.netmask);
        fs.writeFileSync(this.network.config, data, 'utf8');
    }
    deleteFile() {
        fs.rmSync(this.network.config);
    }
}

module.exports = KVM;