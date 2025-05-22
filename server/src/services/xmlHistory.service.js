const XmlComparison = require('../models/xmlComparison.model');

const fetchHistory = async (product) => {
  const filter = product ? { selectedProduct: product } : {};
  return XmlComparison.find(filter).sort({ date: -1 });
};

module.exports = {
  fetchHistory,
};
