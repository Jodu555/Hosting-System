const express = require('express');
const { Database } = require('@jodu555/mysqlapi');
const { getProxmoxApi } = require('../../utils/utils');
const router = express.Router();
const database = Database.getDatabase();


//TODO: Think maybe of other routes or also to implement these routes into the socket handling
//TODO: Maybe implement some type of backup routes

router.get('/start', async (req, res, next) => { //To Start the KVM
    const { node, service, product } = req.credentials.kvm;
});
router.get('/stop');  //To Stop the KVM
router.get('/restart'); // To restart the KVM
router.get('/status'); // To get status information about the KVM




module.exports = router;