class Queue {
    constructor() {
        this.queue = [];
    }
    /**
     * @returns {Object}
     */
    get() {
        return this.queue.shift();
    }
    push(item) {
        this.queue.push(item);
    }
    /**
     * @returns {Boolean} 
     */
    isEmpty() {
        return this.queue.length == 0;
    }
}

module.exports = Queue;