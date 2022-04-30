const express = require('express');
const router = express.Router();


router.get('/start');  //To Start the KVM
router.get('/stop');  //To Stop the KVM
router.get('/restart'); // To restart the KVM
router.get('/status'); // To get status information about the KVM




module.exports = router;