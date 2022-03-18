const crypto = require('crypto');
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const algorithm = 'aes-256-ctr';

const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
    // const cypher = crypto.createCipher('aes-128-cbc', secretKey);
    // let mystr = cypher.update(text, 'utf8', 'hex');
    // mystr += cypher.final('hex');
    // return mystr;
};

const decrypt = (hash) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrpyted.toString();
    // const cypher = crypto.createDecipher('aes-128-cbc', secretKey);
    // let mystr = cypher.update(hash, 'hex', 'utf8');
    // mystr += cypher.final('utf8');
    // return mystr;
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