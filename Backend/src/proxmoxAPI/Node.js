const ProxmoxAuthorizer = require('./ProxmoxAuthorizer');
const { get, post } = require('./networking');
const VM = require('./VM')
class Node {
    constructor(ProxmoxAPI, ID) {
        this.ProxmoxAPI = ProxmoxAPI;
        this.ID = ID;
        this.auth = new ProxmoxAuthorizer(this.ProxmoxAPI);
    }

    async information(node) {
        const response = await get(this.ProxmoxAPI.URL + '/nodes/' + this.ID + '/status', {
            cookie: `PVEAuthCookie=${this.auth.getTicket()};`
        });
        return await response.json();
    }

    getVM(ID) {
        return new VM(this, ID);
    }
}

module.exports = Node;