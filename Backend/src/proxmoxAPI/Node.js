class Node {
    constructor(ProxmoxAPI, ID) {
        this.ProxmoxAPI = ProxmoxAPI;
        this.ID = ID;
    }

    async information(node) {
        const response = await get(this.URL + '/nodes/' + this.ID + '/status', {
            cookie: `PVEAuthCookie=${this.auth.data.ticket};`
        });
        console.log(response);
        return await response.json();
    }

    getVM(ID) {
        return new VM(this, ID);
    }
}

module.exports = Node;