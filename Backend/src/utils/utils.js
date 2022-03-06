const Queue = require("../classes/Queue");
const ProxmoxApi = require("../proxmoxAPI/ProxmoxAPI");

let queue = new Queue();
let proxmoxAPI = new ProxmoxApi(process.env.URL + '/api2/json', {
    username: 'root@pam',
    password: process.env.PASSWORD
})


setInterval(async () => {
    if (queue.isEmpty()) return;
    console.log('TICK', queue.queue.length);
    const obj = queue.get();
    if (obj.action == 'CREATE-KVM') {
        const kvm = obj.kvm;
        await kvm.create();
    }
}, 2000);



const getQueue = () => queue;
const getProxmoxApi = async () => {
    if (!proxmoxAPI.auth)
        await proxmoxAPI.authenticate();
    return proxmoxAPI;
};

module.exports = {
    getQueue,
    getProxmoxApi
}