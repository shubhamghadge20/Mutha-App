const express = require('express');
const { compareXml } = require('../../controllers/xml.controller');

const router = express.Router();

router.get('/compare', compareXml);

module.exports = router;
