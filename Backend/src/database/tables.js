const { Database } = require('@jodu555/mysqlapi');
const database = Database.getDatabase();

function create() {
    createTables();
    createSchemas();
}

function createTables() {
    database.createTable('accounts', {
        options: {
            PK: 'UUID',
        },
        'UUID': {
            type: 'varchar(64)',
            null: false,
        },
        'username': {
            type: 'varchar(64)',
            null: false,
        },
        'email': {
            type: 'varchar(64)',
            null: false,
        },
        'password': {
            type: 'varchar(64)',
            null: false,
        },
        'balance': {
            type: 'float',
            null: false,
        },
        'refCode': {
            type: 'varchar(64)',
            null: false,
        },
    });

    database.createTable('kvm_packages', {
        options: {
            PK: 'UUID',
        },
        'UUID': {
            type: 'varchar(64)',
            null: false,
        },
        'cores': {
            type: 'int',
            null: false,
        },
        'memory': {
            type: 'int',
            null: false,
        },
        'storage': {
            type: 'int',
            null: false,
        },
    });
}

const createUUID = () => {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

generateID = (len) => {
    const poss = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    const id = '';
    for (let i = 0; i < len; i++) {
        id += poss[Math.floor(Math.random() * poss.length)];
    }
}

function createSchemas() {
    const registerSchema = {
        options: {
        },
        UUID: {
            default: createUUID,
        },
        username: {
            anum: false,
            min: 5,
            max: 25,
        },
        email: {
            email: true
        },
        password: {
            min: 3
        },
        balance: {

        },
        refCode: {
            value: generateID(6),
        },
    };
}

module.exports = create;