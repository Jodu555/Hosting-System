const express = require('express');
const router = express.Router();


router.get('/start');
router.get('/stop');
router.get('/restart');
router.get('/status');




module.exports = router;