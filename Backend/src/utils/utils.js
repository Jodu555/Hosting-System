const Queue = require("../classes/Queue");

let queue = new Queue();

setInterval(async () => {
    if (queue.isEmpty()) return;
    const obj = queue.get();
    if (obj.action == 'CREATE-KVM') {
        const kvm = obj.kvm;
        kvm.create();
    }
}, 1000);



const getQueue = () => queue;

module.exports = {
    getQueue
}