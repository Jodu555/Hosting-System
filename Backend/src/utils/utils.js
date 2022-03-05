const Queue = require("../classes/Queue");

let queue = new Queue();

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

module.exports = {
    getQueue
}