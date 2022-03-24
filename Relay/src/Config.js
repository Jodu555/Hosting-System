const fs = require('fs');
const path = require('path');


class Config {
    constructor(config, path = '') {
        this.config = config;
        this.path = path;
        this.load();
        this.save();
    }

    getPath() {
        return path.join(__dirname, this.path, 'config.json');
    }

    load() {
        this.config = 
    }

    save() {

    }

}

module.exports = Config;