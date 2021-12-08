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
    getHeaders() {
        return {
            cookie: `PVEAuthCookie=${this.auth.getTicket()};`,
            CSRFPreventionToken: this.auth.getToken(),
        }
    }
}

module.exports = ProxmoxAuthorizer;