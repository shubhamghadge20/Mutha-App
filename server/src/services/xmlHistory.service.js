const { XmlComparison } = require('../models/');

const fetchHistory = async (product, page, limit, startTime, endTime) => {
  const skip = (page - 1) * limit;
  const filter = {};

  if (startTime && endTime) {
    filter.date = {
      $gte: new Date(Number(startTime)),
      $lte: new Date(Number(endTime)),
    };
  }

  if (product) {
    filter.selectedProduct = product;
  }

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
