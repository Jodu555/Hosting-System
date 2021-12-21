const express = require('express');
const router = express.Router();
const { Database } = require('@jodu555/mysqlapi');
const database = Database.getDatabase();

router.get('/', async (req, res, next) => { //List Packages
    try {
        const response = await database.get('kvm_packages').get();
        res.json(response);
    } catch (error) {
        next(error);
    }
});

module.exports = {
    router,
};
