class Queue {
    constructor() {
        this.queue = [];
    }
    get() {
        return this.queue.shift();
    }
    push(item) {
        this.queue.push(item);
    }
}

module.exports = Queue;