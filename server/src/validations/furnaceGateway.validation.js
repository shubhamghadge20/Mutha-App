const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createFurnaceGateway = {
  body: Joi.object()
    .keys({
      furnaceId: Joi.string().trim().required().label('Furnace ID'),
      gatewayMac: Joi.string()
        .trim()
        .pattern(/^[A-Fa-f0-9]{12}$/)
        .required()
        .label('Gateway MAC Address'),
    })
    .required(),
};

const getFurnaceGateways = {
  query: Joi.object().keys({
    furnaceId: Joi.string().trim(),
    gatewayMac: Joi.string().trim(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getFurnaceGateway = {
  params: Joi.object().keys({
    furnaceGatewayId: Joi.string().required().custom(objectId),
  }),
};

const updateFurnaceGateway = {
  params: Joi.object().keys({
    furnaceGatewayId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      furnaceId: Joi.string().trim(),
      gatewayMac: Joi.string()
        .trim()
        .pattern(/^[A-Fa-f0-9]{12}$/),
    })
    .min(1)
    .required(),
};

const deleteFurnaceGateway = {
  params: Joi.object().keys({
    furnaceGatewayId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createFurnaceGateway,
  getFurnaceGateways,
  getFurnaceGateway,
  updateFurnaceGateway,
  deleteFurnaceGateway,
};
