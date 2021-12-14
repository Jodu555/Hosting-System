const fs = require('fs');

class KVM {
    constructor(ID, ip, mac, gateway, netmask) {
        this.ID = ID;
        this.ip = ip;
        this.mac = mac;
        this.gateway = gateway;
        this.netmask = netmask;
    }

    prepareFile() {
        fs.copyFileSync(process.cwd() + '/work/network-template.txt', process.cwd() + '/work/network-config-' + this.ID + '.txt');
        //Step 1: Copy The File
        //Step 2: rewrite the file content to update network
        //Step 3: Upload the file via SSH
    }
}

module.exports = KVM;