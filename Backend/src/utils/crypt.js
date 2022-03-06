const generateUUID = () => {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

const generateID = (len) => {
    const poss = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    let id = '';
    for (let i = 0; i < len; i++) {
        id += poss[Math.floor(Math.random() * poss.length)];
    }
    return id;
}

const getRandomFromArray = (array) => {
    if (!Array.isArray(array))
        throw new Error('Expected Array')
    return array[Math.floor(Math.random() * array.length)];
}

module.exports = {
    generateUUID,
    generateID,
    getRandomFromArray
}