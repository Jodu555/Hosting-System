const express = require('express');
const controller = require('./controller');
const authManager = require('../../utils/authManager');
const router = express.Router();

router.get('/', controller.list); //List Packages
router.post('/', authManager.authenticationFull((user) => {
    return user.UUID == 'a6e7ba88-53eb-4233-8789-691741583b3a';
}), controller.create); //Create Package



module.exports = {
    router,
};
