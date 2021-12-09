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
        return new VMStatus(this);
    }
}

class VMStatus {
    constructor(VM) {
        this.VM = VM;
        this.auth = this.VM.auth;
        this.url = `${this.VM.url}/${this.VM.ID}/status/`;
    }
    async current() {
        const response = await get(`${this.url}/${this.ID}/status/current`, this.auth.getHeaders());
        return await response.json();
    }
    async reboot(timeout = 0) {
        const response = await post(`${this.url}/${this.ID}/status/reboot`, { timeout }, this.auth.getHeaders());
        return await response.json();
    }
    async reset(skiplock) {
        const response = await post(`${this.url}/${this.ID}/status/reset`, { skiplock }, this.auth.getHeaders());
        return await response.json();
    }
    async resume(data = {}) {
        const response = await post(`${this.url}/${this.ID}/status/resume`, data, this.auth.getHeaders());
        return await response.json();
    }
    async shutdown(data = {}) {
        const response = await post(`${this.url}/${this.ID}/status/shutdown`, data, this.auth.getHeaders());
        return await response.json();
    }
    async start(data = {}) {
        const response = await post(`${this.url}/${this.ID}/status/start`, data, this.auth.getHeaders());
        return await response.json();
    }
    async stop(data = {}) {
        const response = await post(`${this.url}/${this.ID}/status/stop`, data, this.auth.getHeaders());
        return await response.json();
    }
    async suspend(data = {}) {
        const response = await post(`${this.url}/${this.ID}/status/suspend`, data, this.auth.getHeaders());
        return await response.json();
    }
}



module.exports = VM;