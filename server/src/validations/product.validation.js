const Joi = require('joi');
const { objectId } = require('./custom.validation');

const itemSchema = Joi.object({
  _id: Joi.string().custom(objectId).optional(),
  name: Joi.string().trim().required(),
  uppertolerance: Joi.number().min(0).required(),
  lowertolerance: Joi.number().min(0).required(),
}).custom((item, helpers) => {
  const { uppertolerance, lowertolerance } = item;

  if (uppertolerance === lowertolerance && uppertolerance !== 0) {
    return helpers.message('"uppertolerance" must not be equal to "lowertolerance" unless both are 0');
  }

  return item;
});

const createProduct = {
  body: Joi.object()
    .keys({
      name: Joi.string().trim().required(),
      items: Joi.array().items(itemSchema).min(1).required(),
    })
    .required(),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().required().custom(objectId),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().trim(),
      items: Joi.array().items(itemSchema).min(1),
    })
    .min(1)
    .required(),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
