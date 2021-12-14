const fs = require('fs');

class KVM {
    constructor(ID, ip, mac, gateway, netmask) {
        this.ID = ID;
        this.ip = ip;
        this.mac = mac;
        this.gateway = gateway;
        this.netmask = netmask || '255.255.255.255';
    }

    prepareFile() {
        let data = fs.readFileSync(process.cwd() + '/work/network-template.txt', 'utf-8');
        // fs.copyFileSync(, process.cwd() + '/work/network-config-' + this.ID + '.txt');

        // <ADDRESS> <GATEWAY>

        data = data.replaceAll('<ADDRESS>', this.ip);
        data = data.replaceAll('<GATEWAY>', this.gateway);
        data = data.replaceAll('<NETMASK>', this.netmask);
        fs.writeFileSync(process.cwd() + '/work/network-config-' + this.ID + '.txt', data, 'utf8');

        //Step 1: Copy The File
        //Step 2: rewrite the file content to update network
        //Step 3: Upload the file via SSH
    }
}

module.exports = KVM;