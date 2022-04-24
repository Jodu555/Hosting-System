const axios = require('axios');

let botList = {
};

class TS3Audiobot {

    //TODO: Think about maybe outsourcing the player functions to a player class

    //TODO: Implementation: skip 

    //TODO: Maybe implement some type of setup to auto generate address + name + autoplay

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
        this.player = new TS3AudiobotPlayer(this);
    }


    /**
     * @returns {TS3AudiobotPlayer}
     */
    getPlayer() {
        return this.player;
    }

    /**
     * @param  {String} from='default' from where the initial bot should be copied
     */
    async copy(from = 'default') {
        await this.call(`/settings/copy/${from}/${this.name}`);
    }
    /**
     * @param  {String} key The key you wanna change
     * @param  {String} value The Value you want the key to change to
     */
    async editConfig(key, value) {
        await this.call(`/settings/bot/set/${this.name}/${key}/${this.encUri(value)}`);
    }

    async reload() {
        await this.call(`/settings/bot/reload/${this.name}`);
    }

    /**
     * @param  {Number} channelID The Channel ID where the bot should go into
     * @param  {String} [channelPassword=''] The optional channel password 
     */
    async move(channelID, channelPassword = '') {
        await this.callWithUse(`/bot/move/${channelID}/${this.encUri(channelPassword)}`);
    }

    async connect() {
        await this.call(`/bot/connect/template/${this.name}`);
    }

    async disconnect() {
        this.callWithUse('/bot/disconnect');
    }

    async pm(clientID, message) {
        await this.callWithUse(`/pm/user/${clientID}/${this.encUri(message)}`);
    }
    /**
     * @param  {String} scope='channel' Can be 'channel' or 'server' where ever the message should be send to
     * @param  {String} message
     */
    async sendMessage(scope = 'channel', message) {
        this.callWithUse(`/pm/${scope}/${this.encUri(message)}`);
    }

    async getID() {
        return await this.getIDFromBotList();
    }

    async loadBotList() {
        botList = {};
        const json = await this.call('/bot/list');
        json.data.forEach(bot => {
            botList[bot.Id] = {
                ID: bot.Id,
                name: bot.Name,
                server: bot.Server,
                status: bot.Status,
            }
        });
        console.log(botList);
    }
    async getIDFromBotList() {
        if (Object.values(botList).length <= 0)
            await this.loadBotList();
        let ret;
        Object.entries(botList).forEach(([id, { name }]) => {
            if (name == this.name) {
                ret = id;
            }
        });
        return ret;
    }
    async callWithUse(url = '') {
        return await this.call(`/bot/use/${await this.getID()}/(` + url);
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
            // console.log({ status: response.status, data: response.data });
            return { status: response.status, data: response.data, error: false };
        } catch (error) {
            console.error('Got Call error', url, error);
            return { status: error.response.status || 400, data: error.response.data, error: true, url, error_data: error };
        }
    }
}

class TS3AudiobotPlayer {
    constructor(parent) {
        this.parent = parent;
    }

    /**
     * @param  {Number} volume=10 The volume you want the bot to be set to
     */
    async changeVolume(volume = 10) {
        await this.parent.callWithUse(`/volume/${volume}`);
    }

    async play(url = '') {
        await this.parent.callWithUse(`/play/${this.parent.encUri(url)}`);
    }

    async pause() {
        await this.parent.callWithUse('/pause')
    }
    /**
     * @param  {Number} second=0 The Second where you want the song to be played at
     */
    async seek(second = 0) {
        await this.parent.callWithUse(`/seek/${second}`);
    }

    async getSong() {
        const response = await this.parent.callWithUse('/song');
        return response.data;
    }
}

module.exports = TS3Audiobot;