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
    levelNumToName(num) {
        return Object.values(this.levels).filter(l => l.value == num)[0].name;

    }
    deepLog(level, ...args) {
        if (this.level < level)
            console.log(`${new Date().toLocaleDateString()} - ${this.levelNumToName(level)} | ${[...args].join(' ')}`);
    }
    fatal(...args) {
        this.deepLog(this.levels.fatal.value, ...args);
    }
    error(...args) {
        this.deepLog(this.levels.error.value, ...args);
    }
    warn(...args) {
        this.deepLog(this.levels.warn.value, ...args);
    }
    info(...args) {
        this.deepLog(this.levels.info.value, ...args);
    }
    debug(...args) {
        this.deepLog(this.levels.debug.value, ...args);
    }
}

module.exports = Logger;