const { Database } = require('@jodu555/mysqlapi');
const database = Database.getDatabase();
const { generateUUID, generateID } = require('../utils/crypt');
const { createSchemas } = require('./schemas');

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
            type: 'BIGINT',
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
        'cost': { //The price will be in cents
            type: 'int',
            null: false,
        },
        'cores': {
            type: 'int',
            null: false,
        },
        'sockets': {
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
                'account_UUID': 'accounts/UUID',
                'product_UUID': 'products/UUID',
                'coupon_UUID': 'coupons/UUID'
            },
        },
        'UUID': {
            type: 'varchar(64)',
            null: false,
        },
        'account_UUID': {
            type: 'varchar(64)',
            null: false,
        },
        'status': {
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
        'product_UUID': {
            type: 'varchar(64)',
            null: true,
        },
        'coupon_UUID': {
            type: 'varchar(64)',
            null: true,
        }
    });

    database.createTable('ips', {
        options: {
            PK: 'UUID',
        },
        'UUID': {
            type: 'varchar(64)',
            null: false,
        },
        'IP': {
            type: 'varchar(64)',
            null: false,
        },
        'VMAC': {
            type: 'varchar(64)',
            null: false,
        },
        'GATEWAY': {
            type: 'varchar(64)',
            null: false,
        },
        'USED': {
            type: 'INT',
            null: false,
        },
    });

    database.createTable('kvm_package_services', {
        options: {
            PK: 'UUID',
            FK: {
                'product_UUID': 'products/UUID',
                'ip_UUID': 'ips/UUID',
                'package_UUID': 'kvm_packages/UUID',
            }
        },
        'UUID': {
            type: 'varchar(64)',
            null: false,
        },
        'product_UUID': {
            type: 'varchar(64)',
            null: false,
        },
        'ip_UUID': {
            type: 'varchar(64)',
            null: false,
        },
        'package_UUID': {
            type: 'varchar(64)',
            null: false,
        },
        'pve_ID': {
            type: 'INT',
            null: false,
        },
        'defaultPassword': {
            type: 'TEXT',
            null: true,
        }
    })

}

module.exports = create;