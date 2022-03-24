class Logger {
    constructor(file) {
        this.file = file;
        this.level = -1;
        this.levels = {
            fatal: { value: 4, name: 'Fatal' },
            error: { value: 3, name: 'Error' },
            warn: { value: 2, name: 'Warn' },
            info: { value: 1, name: 'Info' },
            debug: { value: 0, name: 'Debug' }
        }
    }
    setLevel(level) {
        Number.isInteger(level) ?
            this.level = level :
            this.level = this.levels[level].value;
    }
    deepLog(level, ...args) {
        if (this.level > level)
            console.log(``,);
    }
    fatal() {
        deepLog(this.levels.fatal.value);
    }
    error() {
        deepLog(this.levels.error.value);
    }
    warn() {
        deepLog(this.levels.warn.value);
    }
    info() {
        deepLog(this.levels.info.value);
    }
    debug() {
        deepLog(this.levels.debug.value);
    }
}

module.exports = Logger;