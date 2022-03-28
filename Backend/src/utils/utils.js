const KVM = require("../classes/KVM");
const Queue = require("../classes/Queue");
const ProxmoxApi = require("../proxmoxAPI/ProxmoxAPI");

let queue = new Queue();
let proxmoxAPI = new ProxmoxApi(process.env.URL + '/api2/json', {
    username: 'root@pam',
    password: process.env.PASSWORD
});
let io;
let logger;

// QUEUE //
setInterval(async () => {
    if (queue.isEmpty()) return;
    console.log('TICK', queue.queue.length);
    const obj = queue.get();
    if (obj.action == 'CREATE-KVM') {
        /**
         * @type {KVM}
         */
        const kvm = obj.kvm;
        kvm.node = (await getProxmoxApi()).getNode(process.env.DEFAULT_NODE);
        await kvm.create();
    }
}, 2000);

const setIo = (_io) => io = _io;
const getIo = () => io;

const setLogger = (_logger) => logger = _logger;
const getLogger = () => logger;

const getQueue = () => queue;
const getProxmoxApi = async () => {
    if (!proxmoxAPI.auth)
        await proxmoxAPI.authenticate();
    return proxmoxAPI;
};

module.exports = {
    getQueue,
    getProxmoxApi,
    getIo,
    setIo,
    getLogger,
    setLogger,
}