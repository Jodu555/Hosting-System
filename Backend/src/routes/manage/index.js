const express = require('express');
const kvm_controller = require('./kvm');
const router = express.Router();

router.use('/kvm/:ID', kvm_controller); // Manage all the KVM Stuff


module.exports = {
    router,
};
