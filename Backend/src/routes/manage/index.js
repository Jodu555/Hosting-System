const express = require('express');
const kvm_controller = require('./kvm');
const router = express.Router();
const { authentication } = require('../../utils/authManager')

router.use('/kvm/', authentication, kvm_controller); // Manage all the KVM Stuff


module.exports = {
    router,
};
