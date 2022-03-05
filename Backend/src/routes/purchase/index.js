const express = require('express');
const controller = require('./controller');
const router = express.Router();

router.post('/kvm/', controller.purchaseKVM); //Purchase a KVM Server
router.post('/mc/', controller.purchaseMC); //Purchase a MC Server


module.exports = {
    router,
};
