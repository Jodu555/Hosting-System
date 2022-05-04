const express = require('express');
const kvm_controller = require('./kvm');
const router = express.Router();

router.use('/kvm/:ID', (req, res, next) => {
    //TODO: put here the code to validate if the vm ID exists && append it into the req object to dont use duplicate code
}, kvm_controller); // Manage all the KVM Stuff


module.exports = {
    router,
};
