const Joi = require('joi');

const readXML = {
  query: Joi.object().keys({}),
};

module.exports = {
  readXML,
};
