class ProxmoxAuthorizer {
    constructor(ProxmoxAPI) {
        this.ProxmoxAPI = ProxmoxAPI;
    }
    getTicket() {
        return this.ProxmoxAPI.auth.data.ticket;
    }
}

module.exports = ProxmoxAuthorizer;