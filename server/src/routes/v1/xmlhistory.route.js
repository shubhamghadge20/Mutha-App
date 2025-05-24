const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const xmlHistoryValidation = require('../../validations/xmlHistory.validation');
const xmlHistoryController = require('../../controllers/xmlHistory.controller');

const router = express.Router();

router
  .route('/')
  .get(
    auth('getXmlHistory'),
    validate(xmlHistoryValidation.getXmlComparisonHistory),
    xmlHistoryController.getXmlComparisonHistory
  );

router
  .route('/:id')
  .delete(
    auth('manageXmlHistory'),
    validate(xmlHistoryValidation.deleteXmlComparisonHistory),
    xmlHistoryController.deleteXmlComparisonHistory
  );

module.exports = router;
