const express = require('express');
const controller = require('./controller');
const authManager = require('../../utils/authManager');
const router = express.Router();

router.get('/', controller.list); //List Packages
router.post('/', (req, res, next) => authManager.authenticationFull(req, res, next, (user) => {
    return user.uuid = 'xxxxxxxx';
}), controller.create); //Create Package

module.exports = {
    router,
};
