const XmlComparison = require('../models/xmlComparison.model');

const fetchHistory = async (product, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const filter = product ? { selectedProduct: product } : {};

  const [data, total] = await Promise.all([
    XmlComparison.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
    XmlComparison.countDocuments(filter),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const deleteHistoryById = async (id) => {
  return XmlComparison.findByIdAndDelete(id);
};

module.exports = {
  fetchHistory,
  deleteHistoryById,
};
