const express = require('express');
const kvm_controller = require('./kvm');
const { Database } = require('@jodu555/mysqlapi');
const { getProxmoxApi } = require('../../utils/utils');
const router = express.Router();
const database = Database.getDatabase();

router.use('/kvm/:ID', async (req, res, next) => {
    //TODO: put here the code to validate if the vm ID exists && append it into the req object to dont use duplicate code


    const UUID = req.params.ID;
    const node = (await getProxmoxApi()).getNode(process.env.DEFAULT_NODE);
    const kvm_service = await database.get('kvm_package_services').getOne({ UUID });

    if (kvm_service) {

    } else {
        next(new Error('You dont own any kvm service with that ID'));
    }
}, kvm_controller); // Manage all the KVM Stuff


module.exports = {
    router,
};
