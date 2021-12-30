const express = require('express');
const controller = require('./controller');
const router = express.Router();
const { roleAuthorization } = require('../../utils/roleManager')

router.get('/', controller.list); //List All Transactions
router.get('/:ID', controller.showOne); //Show One Transaction

router.post('/', roleAuthorization('admin'), controller.create); //Create a Transaction


module.exports = {
    router,
};
