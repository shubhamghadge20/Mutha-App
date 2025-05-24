const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getXmlHistory = {
  query: Joi.object().keys({
    product: Joi.string().optional(),
  }),
};

const deleteXmlHistory = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  getXmlHistory,
  deleteXmlHistory,
};
