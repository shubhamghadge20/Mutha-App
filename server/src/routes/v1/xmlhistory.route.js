const express = require('express');
const { getXmlComparisonHistory } = require('../../controllers/xmlHistory.controller');

const router = express.Router();

router.get('/', getXmlComparisonHistory);

module.exports = router;
