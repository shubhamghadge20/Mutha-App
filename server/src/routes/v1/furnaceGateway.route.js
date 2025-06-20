const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const furnaceGatewayValidation = require('../../validations/furnaceGateway.validation');
const furnaceGatewayController = require('../../controllers/furnaceGateway.controller');

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageFurnaceGateways'),
    validate(furnaceGatewayValidation.createFurnaceGateway),
    furnaceGatewayController.createFurnaceGateway
  )
  .get(
    auth('getFurnaceGateways'),
    validate(furnaceGatewayValidation.getFurnaceGateways),
    furnaceGatewayController.getFurnaceGateways
  );

router
  .route('/:furnaceGatewayId')
  .get(
    auth('getFurnaceGateways'),
    validate(furnaceGatewayValidation.getFurnaceGateway),
    furnaceGatewayController.getFurnaceGateway
  )
  .patch(
    auth('manageFurnaceGateways'),
    validate(furnaceGatewayValidation.updateFurnaceGateway),
    furnaceGatewayController.updateFurnaceGateway
  )
  .delete(
    auth('manageFurnaceGateways'),
    validate(furnaceGatewayValidation.deleteFurnaceGateway),
    furnaceGatewayController.deleteFurnaceGateway
  );

module.exports = router;
