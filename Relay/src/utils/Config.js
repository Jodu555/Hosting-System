const fs = require('fs');
const path = require('path');


class Config {
    /**
     * @param  {Object} config The initial config
     * @param  {String} path='' The process.cwd() under path for example configs/
     * @param  {String} name='config.json' The configuration file
     */
    constructor(config, path = '', name = 'config.json') {
        this.config = config;
        this.path = path;
        this.name = name;
        if (fs.existsSync(this.getPath()))
            this.load();
        this.save();
    }

    getPath() {
        return path.join(process.cwd(), this.path, this.name);
    }
    load() {
        this.config = JSON.parse(fs.readFileSync(this.getPath(), 'utf-8'));
    }
    save() {
        fs.writeFileSync(this.getPath(), JSON.stringify(this.config, null, 3), 'utf-8');
    }

    get() {
        return this.config;
    }

}

module.exports = Config;