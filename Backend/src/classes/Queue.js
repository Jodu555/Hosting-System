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
    isEmpty() {
        return this.queue.length == 0;
    }
}

module.exports = Queue;