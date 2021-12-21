const express = require('express');
const controller = require('./controller');
const authManager = require('../../utils/authManager');
const router = express.Router();

router.get('/', controller.list);
router.post('/', controller.create);

module.exports = {
    router,
};
