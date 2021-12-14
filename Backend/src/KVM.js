const fs = require('fs');

class KVM {
    constructor(ip, mac, gateway, netmask) {
        this.ip = ip;
        this.mac = mac;
        this.gateway = gateway;
        this.netmask = netmask;
    }

    prepareFile() {
        //Step 1: Copy The File
        //Step 2: rewrite the file content to update network
        //Step 3: Upload the file via SSH
    }
}