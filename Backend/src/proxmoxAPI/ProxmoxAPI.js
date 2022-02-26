const Node = require('./Node');
const { get, post } = require('./networking');
class ProxmoxApi {
    constructor(URL, credentials) {
        this.URL = URL;
        this.credentials = credentials;
    }

    async authenticate() {
        const response = await post(this.URL + '/access/ticket', this.credentials)
        this.auth = response.data;
    }

    getNode(ID) {
        return new Node(this, ID)
    }

}

module.exports = ProxmoxApi