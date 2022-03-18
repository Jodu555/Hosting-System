class Relay {
    constructor() {
        /**
         * @type {[RelayEntity]}
         */
        this.relays = [];
    }
    /**
     * @param  {RelayEntity} relay
     */
    insert(relay) {
        relay.start();
        this.relays.push(relay);
    }
    delete(intPort) {
        const relay = this.relays.find(e => e.intPort == intPort);
        const relayIdx = this.relays.findIndex(e => e.intPort == intPort);

        relay.stop();

        this.relays.splice(relayIdx, 1)
    }
}

module.exports = Relay;