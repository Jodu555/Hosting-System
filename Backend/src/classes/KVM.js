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
        this.debug = true;
    }

    async create() {
        console.log('KVM Creation: ', this);
        this.debug && console.log('Step 1: Clone the template');
        await this._clone();

        this.debug && console.log('Step 2: Configure the new vm');
        const newVM = await this._configure();

        this.debug && console.log('Step 3: Start the VM');
        newVM.status.start();
        await wait(10000); // Wait for the Vm to spin up

        this.debug && console.log('Step 4: Prepare File');
        this.prepareFile();

        this.debug && console.log('Step 5: Upload File');
        await this.uploadFile();

        this.debug && console.log('Step 6: Configure the mac address');
        await this._configureMac(newVM);
        await wait(3000);

        this.debug && console.log('Step 7: Stop the VM');
        await newVM.status.shutdown();
        await wait(9000);

        this.debug && console.log('Step 8: Start the VM');
        await newVM.status.start();
        await wait(7000);

        const password = await generatePassword();
        console.log('Step 9: Changed password to: ' + password);
        this.changePassword(password);
        // HINT: To Change the password just run "echo 'root:145' | sudo chpasswd"


        this.deleteFile(); // Delete the generated network file
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
        let result = await ssh.execCommand(`echo 'root:${password}' | chpasswd`);
        console.log(result);
        await wait(1200);
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