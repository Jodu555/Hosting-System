const ProxmoxAuthorizer = require('./ProxmoxAuthorizer');
const { get, post } = require('./networking');
const VM = require('./VM')
class Node {
    constructor(ProxmoxApi, ID) {
        this.ProxmoxApi = ProxmoxApi;
        this.ID = ID;
        this.auth = new ProxmoxAuthorizer(this.ProxmoxApi);
        this.url = `${this.ProxmoxApi.URL}/nodes`
    }

    async information(node) {
        const response = await get(`${this.url}/${this.ID}/status`, {
            cookie: `PVEAuthCookie=${this.auth.getTicket()};`
        });
        return response.data;
    }

    async getVMStats() {
        const response = await get(`${this.url}/${this.ID}/qemu`, this.auth.getHeaders());
        return response.data.data;
    }
    /**
     * @param  {Number} ID
     * @returns {VM}
     */
    getVM(ID) {
        return new VM(this, ID);
    }
}

module.exports = Node;