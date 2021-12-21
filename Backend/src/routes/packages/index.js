const express = require('express');
const controller = require('./controller');
const authManager = require('../../utils/authManager');
const router = express.Router();
const { isPermitted } = require('../../utils/roleManager')

router.get('/', controller.list); //List Packages

router.post('/', authManager.authenticationFull((user) => isPermitted(user, 'admin')), controller.create); //Create Package



module.exports = {
    router,
};
