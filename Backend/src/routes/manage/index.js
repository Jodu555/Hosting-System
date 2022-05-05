const express = require('express');
const kvm_controller = require('./kvm');
const { Database } = require('@jodu555/mysqlapi');
const { getProxmoxApi } = require('../../utils/utils');
const router = express.Router();
const database = Database.getDatabase();

router.use('/kvm/:ID', async (req, res, next) => {
    const UUID = req.params.ID;
    const node = (await getProxmoxApi()).getNode(process.env.DEFAULT_NODE);
    const kvm_service = await database.get('kvm_package_services').getOne({ UUID });
    const product = database.get('products').getOne({ UUID: kvm_service.product_UUID });

    if (product.account_UUID !== req.credentials.user.UUID) {
        next(new Error('You dont own this package'));
        return;
    }
    if (!kvm_service) {
        next(new Error('You dont own any kvm service with that ID'));
        return;
    }

    req.credentials.kvm = {
        node,
        service: kvm_service,
        product
    };
}, kvm_controller); // Manage all the KVM Stuff


module.exports = {
    router,
};
