const crypto = require('crypto');
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'; // The key insistedly needs 32 chars
const algorithm = 'aes-256-ctr';

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

const bcrypt = require('bcryptjs');
const generatePassword = async () => {
    // const fs = require('fs');
    // const poss = Array(94).fill(0).map((_, i) => String.fromCharCode(i + 33));
    // let pw = '';
    // for (let i = 0; i < 70; i++) {
    //     pw += getRandomFromArray(poss);
    // }
    // fs.writeFileSync('chars.json', JSON.stringify(poss, null, 3));
    // 
    const hpw = Array(10).fill(0).map(e => generateUUID().replaceAll('-', '')).join('');
    const pw = (await bcrypt.hash(hpw, 9)).substring(0, 15);
    return pw;
};


const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

const decrypt = (hash) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrpyted.toString();
};

module.exports = {
    generateUUID,
    generateID,
    getRandomFromArray,
    generatePassword,
    encrypt,
    decrypt
}