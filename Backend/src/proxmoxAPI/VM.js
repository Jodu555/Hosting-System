const ProxmoxAuthorizer = require('./ProxmoxAuthorizer');
const { get, post } = require('./networking');
class VM {
    constructor(Node, ID) {
        this.Node = Node;
        this.ProxmoxApi = this.Node.ProxmoxApi;
        this.ID = ID;
        this.auth = new ProxmoxAuthorizer(this.ProxmoxApi);
    }

    async create(data) {
        data.vmid = this.ID;
        const response = await post(this.ProxmoxApi.URL + `/nodes/${this.Node.ID}/qemu`, data, {
            cookie: `PVEAuthCookie=${this.auth.getTicket()};`,
            CSRFPreventionToken: this.auth.getToken(),
        });
        console.log(response);
        // console.log(await response.text());
        console.log(await response.json());
    }

    async clone(data) {
        const response = await post(this.ProxmoxApi.URL + `/nodes/${this.Node.ID}/qemu/${data.vmid}/clone`, data, {
            cookie: `PVEAuthCookie=${this.auth.getTicket()};`,
            CSRFPreventionToken: this.auth.getToken(),
        });
        console.log(response);
        // console.log(await response.text());
        console.log(await response.json());
    }

    async configurate(data) {
        const response = await post(this.ProxmoxApi.URL + `/nodes/${this.Node.ID}/qemu/${this.ID}/config`, data, {
            cookie: `PVEAuthCookie=${this.auth.getTicket()};`,
            CSRFPreventionToken: this.auth.getToken(),
        });
        console.log(response);
        console.log(await response.json());
    }
}

module.exports = VM;