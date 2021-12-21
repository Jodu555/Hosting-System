const express = require('express');
const controller = require('./controller');
const router = express.Router();
const { roleAuthorization } = require('../../utils/roleManager')

router.get('/', controller.list); //List Packages

router.post('/', roleAuthorization('admin'), controller.create); //Create Package



module.exports = {
    router,
};
