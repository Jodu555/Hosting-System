const fs = require('fs');
const path = require('path');
const { NodeSSH } = require('node-ssh')
const ProxmoxAPI = require('./proxmoxAPI/ProxmoxAPI')

const defaultNetworkConfig = path.join(process.cwd(), 'work', 'network-template.txt');

const proxmoxAPI = new ProxmoxAPI(process.env.URL + '/api2/json', {
    username: 'root@pam',
    password: process.env.PASSWORD
})

await proxmoxAPI.authenticate();

const node = proxmoxAPI.getNode('ns3177623');

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
        const template = node.getVM(100);
        await template.clone({
            newid: 101,
            full: true // So the storage is independent
        });
        // Step 2: Configure the new vm
        const newVM = node.getVM(101);
        await newVM.configurate({
            name: 'Test-API',
            cores: 4,
            sockets: 4,
            memory: 6024,
            net0: 'virtio=02:00:00:01:c6:6b,bridge=vmbr0,firewall=1',
            // scsi0: 'local:32,format=qcow2'
        })
        // Step 3: Prepare File
        this.prepareFile();
        const status = await this.uploadFile();
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