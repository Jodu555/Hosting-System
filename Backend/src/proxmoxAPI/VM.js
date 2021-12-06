class VM {
    constructor(ProxmoxApi, ID) {
        this.ProxmoxApi = ProxmoxApi;
        this.ID = ID;
    }

    async create(data) {
        data.vmid = this.ID;
        const response = await post(this.URL + '/nodes/ns3177623/qemu', data, {
            cookie: `PVEAuthCookie=${this.auth.data.ticket};`,
            CSRFPreventionToken: this.auth.data.CSRFPreventionToken,
        });
        console.log(response);
        // console.log(await response.text());
        console.log(await response.json());
    }

    async cloneVM(data) {
        const response = await post(this.URL + `/nodes/ns3177623/qemu/${data.vmid}/clone`, data, {
            cookie: `PVEAuthCookie=${this.auth.data.ticket};`,
            CSRFPreventionToken: this.auth.data.CSRFPreventionToken,
        });
        console.log(response);
        // console.log(await response.text());
        console.log(await response.json());
    }

    async configurate(data) {
        const response = await post(this.URL + `/nodes/ns3177623/qemu/${this.ID}/config`, data, {
            cookie: `PVEAuthCookie=${this.auth.data.ticket};`,
            CSRFPreventionToken: this.auth.data.CSRFPreventionToken,
        });
        console.log(response);
        console.log(await response.json());
    }
}