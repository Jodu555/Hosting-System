const ProxmoxAuthorizer = require('./ProxmoxAuthorizer');
const { get, post, put } = require('./networking');
class VM {
    constructor(Node, ID) {
        this.Node = Node;
        this.ProxmoxApi = this.Node.ProxmoxApi;
        this.ID = ID;
        this.auth = new ProxmoxAuthorizer(this.ProxmoxApi);
        this.url = `${this.Node.url}/${this.Node.ID}/qemu`;
    }

    async create(data) {
        const response = await post(this.url, data, this.auth.getHeaders());
        console.log(await response.json());
    }

    async clone(data) {
        const response = await post(`${this.url}/${this.ID}/clone`, data, this.auth.getHeaders());
        console.log(await response.json());
    }

    async configurate(data) {
        const response = await post(`${this.url}/${this.ID}/config`, data, this.auth.getHeaders());
        console.log(await response.json());
    }

    async resize(data) {
        const response = await put(`${this.url}/${this.ID}/resize`, data, this.auth.getHeaders());
        console.log(await response.json());
    }

    get status() {
        return {
            current: async () => {
                const response = await get(`${this.url}/${this.ID}/status/current`, this.auth.getHeaders());
                return await response.json();
            },
            reboot: async (timeout = 0) => {
                const response = await post(`${this.url}/${this.ID}/status/reboot`, { timeout }, this.auth.getHeaders());
                return await response.json();
            },
            reset: async (skiplock) => {
                const response = await post(`${this.url}/${this.ID}/status/reset`, { skiplock }, this.auth.getHeaders());
                return await response.json();
            },
            //resume, shutdown
            start: async (data = {}) => {
                const response = await post(`${this.url}/${this.ID}/status/start`, data, this.auth.getHeaders());
                return await response.json();
            },
            stop: async (data = {}) => {
                const response = await post(`${this.url}/${this.ID}/status/stop`, data, this.auth.getHeaders());
                return await response.json();
            },
            //suspend
        }
    }
}



module.exports = VM;