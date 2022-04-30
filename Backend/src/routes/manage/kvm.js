const express = require('express');
const router = express.Router();


//TODO: Think maybe of other routes or also to implement these routes into the socket handling

router.get('/start');  //To Start the KVM
router.get('/stop');  //To Stop the KVM
router.get('/restart'); // To restart the KVM
router.get('/status'); // To get status information about the KVM




module.exports = router;