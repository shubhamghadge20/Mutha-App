const express = require('express');
const auth = require('../../middlewares/auth');
const { mqttController } = require('../../controllers/');

const router = express.Router();

router.get('/lock', mqttController.lockFurnace);
router.get('/unlock', mqttController.unlockFurnace);

module.exports = router;
