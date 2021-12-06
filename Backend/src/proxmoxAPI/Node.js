const ProxmoxAuthorizer = require('./ProxmoxAuthorizer');

class Node {
    constructor(ProxmoxAPI, ID) {
        this.ProxmoxAPI = ProxmoxAPI;
        this.ID = ID;
        this.auth = new ProxmoxAuthorizer(this.ProxmoxAPI);
    }

    async information(node) {
        const response = await get(this.URL + '/nodes/' + this.ID + '/status', {
            cookie: `PVEAuthCookie=${this.auth.getTicket()};`
        });
        console.log(response);
        return await response.json();
    }

    getVM(ID) {
        return new VM(this, ID);
    }
}

module.exports = Node;