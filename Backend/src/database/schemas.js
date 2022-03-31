const { Database } = require('@jodu555/mysqlapi');
const database = Database.getDatabase();
const { generateUUID, generateID } = require('../utils/crypt');

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
        cost: {
            default: 100,
            min: 100,
        },
        cores: {
            min: 1,
            max: 15,
        },
        sockets: {
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

    const createTransactionSchema = {
        UUID: {
            value: generateUUID,
        },
        status: {
            enum: ['pending', 'completed'],
        },
        amount: {
            min: 0,
            max: 99.99,
        },
        product_UUID: {
            required: false,
        },
        coupon_UUID: {
            required: false,
        },
    }

    const createCouponSchema = {
        UUID: {
            value: generateUUID,
        },
        type: {
            enum: ['percent', 'fix'],
        },
        amount: {
            min: 0,
            max: 99.99
        },
        limit: {
            min: 5,
            max: 100000
        },
        redeemed: {
            default: 0,
        }
    }

    const purchaseKVM = {
        UUID: {
            value: generateUUID,
        },
        packageUUID: {
            type: 'TEXT',
            required: true,
        }
    }

    database.registerSchema('registerSchema', registerSchema, 'accounts');
    database.registerSchema('loginSchema', loginSchema, 'accounts');

    database.registerSchema('createPackageSchema', createPackageSchema, 'kvm_packages');

    database.registerSchema('createTransactionSchema', createTransactionSchema, 'transactions');

    database.registerSchema('createCouponSchema', createCouponSchema, 'coupons');


    database.registerSchema('purchaseKVM', purchaseKVM);
}

module.exports = { createSchemas };