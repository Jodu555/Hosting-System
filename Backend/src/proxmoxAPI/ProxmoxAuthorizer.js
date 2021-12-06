class ProxmoxAuthorizer {
    constructor(ProxmoxAPI) {
        this.ProxmoxAPI = ProxmoxAPI;
    }
    getTicket() {
        return this.ProxmoxAPI.auth.data.ticket;
    }
    getToken() {
        return this.ProxmoxAPI.auth.data.CSRFPreventionToken
    }
}

module.exports = ProxmoxAuthorizer;