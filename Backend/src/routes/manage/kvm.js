const express = require('express');
const { getProxmoxApi } = require('../../utils/utils');
const router = express.Router();


//TODO: Think maybe of other routes or also to implement these routes into the socket handling
//TODO: Maybe implement some type of backup routes

router.get('/start', async (req, res, next) => { //To Start the KVM
    const UUID = req.params.ID;
    const node = (await getProxmoxApi()).getNode(process.env.DEFAULT_NODE);

    const vm = node.getVM(VM_ID);
});
router.get('/stop');  //To Stop the KVM
router.get('/restart'); // To restart the KVM
router.get('/status'); // To get status information about the KVM




module.exports = router;