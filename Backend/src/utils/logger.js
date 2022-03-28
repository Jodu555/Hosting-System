const { getLogger } = require("./utils");

const initialize = () => {
    const logger = getLogger();
    logger.createModule({
        name: 'KVM-Creation',
        level: -1,
    });
};

module.exports = {
    initialize,
}