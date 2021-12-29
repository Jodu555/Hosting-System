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

    database.createTable('products', {
        options: {
            PK: 'UUID',
            FK: {
                'account_UUID': 'accounts/UUID'
            },
        },
        'UUID': {
            type: 'varchar(64)',
            null: false,
        },
        'account_UUID': {
            type: 'varchar(64)',
            null: true,
        },
        'cost': {
            type: 'float',
            null: false,
        },
        'nextPayment': {
            type: 'varchar(64)',
            null: false,
        },
        'service_UUID': {
            type: 'varchar(64)',
            null: false,
        },
        'name': {
            type: 'varchar(64)',
            null: false,
        },

    });

    database.createTable('coupons', {
        options: {
            PK: 'UUID',
        },
        'UUID': {
            type: 'varchar(64)',
            null: false,
        },
        'type': {
            type: 'varchar(64)',
            null: false,
        },
        'amount': {
            type: 'float',
            null: false,
        },
        'stock': {
            type: 'int',
            null: true,
        },
        'redeemed': {
            type: 'int',
            null: true,
        }
    });

    database.createTable('transactions', {
        options: {
            PK: 'UUID',
            FK: {
                'product_UUID': 'products/UUID',
                'coupon_UUID': 'coupons/UUID'
            },
        },
        'UUID': {
            type: 'varchar(64)',
            null: false,
        },
        'status': {
            type: 'varchar(64)',
            null: false,
        },
        'amount': {
            type: 'float',
            null: false,
        },
        'product_UUID': {
            type: 'varchar(64)',
            null: true,
        },
        'coupon_UUID': {
            type: 'varchar(64)',
            null: true,
        }
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


    const createPackageSchema = {
        UUID: {
            value: generateUUID,
        },
        name: {
            anum: false,
            min: 3,
            max: 20,
        },
        cores: {
            min: 1,
            max: 15,
        },
        memory: {
            min: 1,
            max: 32,
        },
        storage: {
            min: 5,
            max: 500,
        },
    };

    const transactionSchema = {
        UUID: {
            value: generateUUID,
        },
        status: {
            enum: ['pending', 'completed'],
        },
        amount: {
            min: 0,
            max: 99.99,
        }
    }

    database.registerSchema('registerSchema', registerSchema, 'accounts');
    database.registerSchema('loginSchema', loginSchema, 'accounts');

    database.registerSchema('createPackageSchema', createPackageSchema, 'kvm_packages');

    return;
    database.registerSchema('transactionSchema', transactionSchema, 'transactions');
}

module.exports = create;