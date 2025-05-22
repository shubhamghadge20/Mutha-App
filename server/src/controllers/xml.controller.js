const catchAsync = require('../utils/catchAsync');
const { handleXmlComparison } = require('../services/xml.service');

const compareXml = catchAsync(async (req, res) => {
  const selectedProductName = req.query.product;
  console.log('Product name : ', selectedProductName);
  if (!selectedProductName) {
    return res.status(400).json({ message: 'Product name is required in query string' });
  }

  const result = await handleXmlComparison(selectedProductName);
  res.send(result);
});

module.exports = {
  compareXml,
};
