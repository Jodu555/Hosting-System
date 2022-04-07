class TS3Audiobot {

    /**
     * @param  {Object} auth
     * @param  {String} auth.USERNAME
     * @param  {String} auth.TOKEN
     * @param  {String} name the Bots Name
     */
    constructor(auth, name) {
        this.auth = auth;
        this.name = name;
    }

    copy() {

    }
    /**
     * @param  {String} key The key you wanna change
     * @param  {String} value The Value you want the key to change to
     */
    async editConfig(key, value) {
        await this.call(`/settings/bot/set/${saveName}/connect.address/${encUri(address)}`);
    }

    reload() {

    }

    connect() {

    }

    async _call(url = '') {
        url = API_URL + url;
        try {
            const authStr = btoa(`${process.env.API_USERNAME}:${process.env.API_TOKEN}`);
            const response = await axios.get(url, {
                headers: { 'Authorization': `Basic ${authStr}` }
            });
            console.log({ status: response.status, data: response.data });
            return { status: response.status, data: response.data, error: false };
        } catch (error) {
            console.error('Got Call error', url, error);
            return { status: response.status, data: response.data, error: true, url, error_data: error };
        }
    }
}

module.exports = TS3Audiobot;