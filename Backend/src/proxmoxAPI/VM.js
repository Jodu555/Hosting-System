const ProxmoxAuthorizer = require('./ProxmoxAuthorizer');
const { get, post, put } = require('./networking');
class VM {
    constructor(Node, ID) {
        this.Node = Node;
        this.ProxmoxApi = this.Node.ProxmoxApi;
        this.ID = ID;
        this.auth = new ProxmoxAuthorizer(this.ProxmoxApi);
        this.url = this.ProxmoxApi.URL + `/nodes/${this.Node.ID}/qemu`;
    }

    async create(data) {
        data.vmid = this.ID;
        data.node = this.Node.ID;
        const response = await post(this.url, data, {
            cookie: `PVEAuthCookie=${this.auth.getTicket()};`,
            CSRFPreventionToken: this.auth.getToken(),
        });
        console.log(response);
        // console.log(await response.text());
        console.log(await response.json());
    }

    async clone(data) {
        const response = await post(`${this.url}/${this.ID}/clone`, data, {
            cookie: `PVEAuthCookie=${this.auth.getTicket()};`,
            CSRFPreventionToken: this.auth.getToken(),
        });
        console.log(response);
        // console.log(await response.text());
        console.log(await response.json());
    }

    async configurate(data) {
        const response = await post(`${this.url}/${this.ID}/config`, data, {
            cookie: `PVEAuthCookie=${this.auth.getTicket()};`,
            CSRFPreventionToken: this.auth.getToken(),
        });
        console.log(response);
        console.log(await response.json());
    }

    async resize(data) {
        const response = await put(`${this.url}/${this.ID}/resize`, data, {
            cookie: `PVEAuthCookie=${this.auth.getTicket()};`,
            CSRFPreventionToken: this.auth.getToken(),
        });
    }

    get status() {
        return {
            current: async () => {
                const response = await get(`${this.url}/${this.ID}/status/current`, {
                    cookie: `PVEAuthCookie=${this.auth.getTicket()};`,
                    CSRFPreventionToken: this.auth.getToken(),
                });
                return await response.json();
            },
            reboot: async (timeout = 0) => {
                const response = await post(`${this.url}/${this.ID}/status/reboot`, { timeout }, {
                    cookie: `PVEAuthCookie=${this.auth.getTicket()};`,
                    CSRFPreventionToken: this.auth.getToken(),
                });
                return await response.json();
            },
            reset: async (skiplock) => {
                const response = await post(`${this.url}/${this.ID}/status/reset`, { skiplock }, {
                    cookie: `PVEAuthCookie=${this.auth.getTicket()};`,
                    CSRFPreventionToken: this.auth.getToken(),
                });
                return await response.json();
            },
            start: async (data = {}) => {
                const response = await post(`${this.url}/${this.ID}/status/start`, data, {
                    cookie: `PVEAuthCookie=${this.auth.getTicket()};`,
                    CSRFPreventionToken: this.auth.getToken(),
                });
                return await response.json();
            },
            stop: async (data = {}) => {
                const response = await post(`${this.url}/${this.ID}/status/stop`, data, {
                    cookie: `PVEAuthCookie=${this.auth.getTicket()};`,
                    CSRFPreventionToken: this.auth.getToken(),
                });
                return await response.json();
            },
        }
    }
}



module.exports = VM;