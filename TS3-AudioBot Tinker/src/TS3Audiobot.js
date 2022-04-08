class TS3Audiobot {

    /**
     * @param  {Object} auth
     * @param  {String} auth.API_URL
     * @param  {String} auth.USERNAME
     * @param  {String} auth.TOKEN
     * @param  {String} name the Bots Name
     */
    constructor(auth, name) {
        this.auth = auth;
        const nameValidation = /(?![a-zA-Z0-9_-])./gm;
        this.name = name.replace(nameValidation, '');

        this.encUri = u => encodeURIComponent(u);
    }
    /**
     * @param  {String} from='default' from where the initial bot should be copied
     */
    async copy(from = 'default') {
        await call(`/settings/copy/${from}/${this.name}`);
    }
    /**
     * @param  {String} key The key you wanna change
     * @param  {String} value The Value you want the key to change to
     */
    async editConfig(key, value) {
        await this.call(`/settings/bot/set/${this.name}/${key}/${this.encUri(value)}`);
    }

    async pm(clientID, message) {
        await this.callWithUse(`/pm/user/${clientID}/${this.encUri(message)}`);
    }
    /**
     * @param  {Number} channelID The Channel ID where the bot should go into
     * @param  {String} [channelPassword=''] The optional channel password 
     */
    async move(channelID, channelPassword = '') {
        await this.callWithUse(`/bot/move/${channelID}/${this.encUri(channelPassword)}`);
    }

    async reload() {
        await call(`/settings/bot/reload/${this.name}`);
    }

    async connect() {
        await call(`/bot/connect/template/${this.name}`);
    }

    async callWithUse(url = '') {
        await this.call(`/bot/use/${this.getID}/(` + url);
    }
    /**
     * @param  {String} scope='channel' Can be 'channel' or 'server' where ever the message should be send to
     * @param  {String} message
     */
    async sendMessage(scope = 'channel', message) {
        this.callWithUse(`/pm/${scope}/${this.encUri(message)}`);
    }

    get getID() {
        //TODO: Figure out how to get the client id
    }

    /**
     * @param  {String} url='' Calls the bot with the api url
     */
    async call(url = '') {
        url = this.auth.API_URL + url;
        try {
            const authStr = btoa(`${this.auth.USERNAME}:${this.auth.TOKEN}`);
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