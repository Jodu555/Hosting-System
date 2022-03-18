const crypto = require('crypto');
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';

const encrypt = (text) => {
    const cypher = crypto.createCipher('aes-128-cbc', secretKey);
    let mystr = cypher.update(text, 'utf8', 'hex');
    mystr += cypher.final('hex');
    return mystr;
};

const decrypt = (hash) => {
    const cypher = crypto.createDecipher('aes-128-cbc', secretKey);
    let mystr = cypher.update(hash, 'hex', 'utf8');
    mystr += cypher.final('utf8');
    return mystr;
};

console.time('crypt');
const hash = encrypt(JSON.stringify({ type: 'Relay', ip: '127.0.0.1' }));
console.log(hash);

const auth = JSON.parse(decrypt(hash));
console.log(auth);
console.timeEnd('crypt'); // 6-7ms


module.exports = {
    encrypt,
    decrypt
};