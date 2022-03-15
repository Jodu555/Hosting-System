const ProxmoxAuthorizer = require('./ProxmoxAuthorizer');
const { get, post, put, del } = require('./networking');

const debug = false;
class VM {
    constructor(Node, ID) {
        this.Node = Node;
        this.ProxmoxApi = this.Node.ProxmoxApi;
        this.ID = ID;
        this.auth = new ProxmoxAuthorizer(this.ProxmoxApi);
        this.url = `${this.Node.url}/${this.Node.ID}/qemu`;
    }
    /**
     * @param  {Obect} data
     */
    async create(data) {
        const response = await post(this.url, data, this.auth.getHeaders());
        debug && console.log(response.data);
    }
    /**
     * @param  {Obect} data
     */
    async clone(data) {
        const response = await post(`${this.url}/${this.ID}/clone`, data, this.auth.getHeaders());
        debug && console.log(response.data);
    }
    /**
     * @param  {Obect} data
     */
    async configurate(data) {
        const response = await post(`${this.url}/${this.ID}/config`, data, this.auth.getHeaders());
        debug && console.log(response.data);
    }
    /**
     * @param  {Obect} data
     */
    async resize(data) {
        const response = await put(`${this.url}/${this.ID}/resize`, data, this.auth.getHeaders());
        debug && console.log(response.data);
    }

    get config() {
        return new Promise(async (resolve, reject) => {
            const response = await get(`${this.url}/${this.ID}/config`, this.auth.getHeaders());
            resolve(response.data);
        });
    }

    get status() {
        return new VMStatus(this);
    }

    get snapshots() {
        return new VMSnapshots(this);
    }

}

class VMSnapshots {
    constructor(VM) {
        this.VM = VM;
        this.auth = this.VM.auth;
        this.url = `${this.VM.url}/${this.VM.ID}/snapshot`;
    }

    async list() {
        const response = await get(`${this.url}`, this.auth.getHeaders());
        return response.data;
    }

    async create(name, data) {
        const response = await post(`${this.url}`, { snapname: name, ...data }, this.auth.getHeaders());
        return response.data;
    }

    getSnapshot(name) {
        return new VMSnapshot(this, name);
    }
}
class VMSnapshot {
    constructor(VMSnapshots, name) {
        this.VMSnapshots = VMSnapshots;
        this.VM = VMSnapshots.VM;
        this.auth = this.VM.auth;
        this.name = name;
        this.url = `${this.VMSnapshots.url}/${name}`;
    }

    async del() {
        const response = await del(`${this.url}/`, this.auth.getHeaders());
        return response.data;
    }

    get config() {
        return new Promise(async (resolve, reject) => {
            const response = await get(`${this.url}/config`, this.auth.getHeaders());
            resolve(response.data);
        });
    }

    async updateConfig(data = {}) {
        const response = await get(`${this.url}/config`, data, this.auth.getHeaders());
        return response.data;
    }

    async rollback() {
        const response = await post(`${this.url}/rollback`, this.auth.getHeaders());
        return response.data;
    }
}
class VMStatus {
    constructor(VM) {
        this.VM = VM;
        this.auth = this.VM.auth;
        this.url = `${this.VM.url}/${this.VM.ID}/status/`;
    }
    async current() {
        const response = await get(`${this.url}current`, this.auth.getHeaders());
        return response.data;
    }
    async reboot(timeout = 0) {
        const response = await post(`${this.url}reboot`, { timeout }, this.auth.getHeaders());
        return response.data;
    }
    async reset(skiplock) {
        const response = await post(`${this.url}reset`, { skiplock }, this.auth.getHeaders());
        return response.data;
    }
    async resume(data = {}) {
        const response = await post(`${this.url}resume`, data, this.auth.getHeaders());
        return response.data;
    }
    async shutdown(data = {}) {
        const response = await post(`${this.url}shutdown`, data, this.auth.getHeaders());
        return response.data;
    }
    async start(data = {}) {
        const response = await post(`${this.url}start`, data, this.auth.getHeaders());
        return response.data;
    }
    async stop(data = {}) {
        const response = await post(`${this.url}stop`, data, this.auth.getHeaders());
        return response.data;
    }
    async suspend(data = {}) {
        const response = await post(`${this.url}suspend`, data, this.auth.getHeaders());
        return response.data;
    }
}



module.exports = VM;