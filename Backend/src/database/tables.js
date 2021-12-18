const { Database } = require('@jodu555/mysqlapi');
const database = Database.getDatabase();

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
            type: 'TEXT',
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



function createSchemas() {
    const len = {
        min: 5,
    }
    const registerSchema = {
        options: {
        },
        UUID: {
            value: generateUUID,
        },
        username: {
            anum: false,
            max: 15,
            ...len
        },
        email: {
            email: true,
            ...len,
            max: 20,
        },
        password: {
            ...len,
            max: 100,
        },
        balance: {
            value: 2.0,
        },
        refCode: {
            value: generateID(6),
        },
    };

    const loginSchema = {
        username: {
            anum: false,
            max: 15,
            ...len
        },
        password: {
            ...len,
            max: 100,
        },
    }
}

module.exports = create;