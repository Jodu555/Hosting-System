const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => { //List Packages
    try {
        const response = database.get('kvm_packages').get({});
        res.json(response);
    } catch (error) {
        next(error);
    }
});

module.exports = {
    router,
};
