const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const xmlValidation = require('../../validations/xml.validation');
const xmlController = require('../../controllers/xmlController');

const router = express.Router();

router.route('/read-xml').get(auth('readXML'), validate(xmlValidation.readXML), xmlController.handleXMLCompare);

module.exports = router;
