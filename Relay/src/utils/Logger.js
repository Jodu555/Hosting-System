class Logger {
    constructor(file) {
        this.file = file;
        this.levels = {
            fatal: 0,
            error: 1,
            warn: 2,
            info: 3,
            debug: 4
        }
    }
    setLevel(level) {

    }
}

module.exports = Logger;