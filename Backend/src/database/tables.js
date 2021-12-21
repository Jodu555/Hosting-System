const { Database } = require('@jodu555/mysqlapi');
const database = Database.getDatabase();
const { generateUUID, generateID } = require('../utils/crypt');

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
        'name': {
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
        min: 7,
    }
    const registerSchema = {
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

    database.registerSchema('registerSchema', registerSchema, 'accounts');
    database.registerSchema('loginSchema', loginSchema, 'accounts');
}

module.exports = create;