const fs = require('fs');
const path = require('path');
const TOML = require('@iarna/toml')

const tomlStr = fs.readFileSync(path.join(__dirname, 'ts3audiobot.toml'), 'utf-8');


const obj = TOML.parse(tomlStr);
console.log(obj);
const str = TOML.stringify(obj);
console.log(str);