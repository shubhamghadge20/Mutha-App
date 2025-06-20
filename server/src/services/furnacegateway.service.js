const httpStatus = require('http-status');
const { FurnaceGateway } = require('../models');
const ApiError = require('../utils/ApiError');

const createFurnaceGateway = async (furnaceGatewayBody) => {
  return FurnaceGateway.create(furnaceGatewayBody);
};

const queryFurnaceGateways = async (filter, options) => {
  const furnaceGateways = await FurnaceGateway.paginate(filter, options);
  return furnaceGateways;
};

const getAllFurnaceGateways = async () => {
  return FurnaceGateway.find();
};

const getFurnaceGatewayById = async (id) => {
  return FurnaceGateway.findById(id);
};

const updateFurnaceGatewayById = async (furnaceGatewayId, updateBody) => {
  const furnaceGateway = await getFurnaceGatewayById(furnaceGatewayId);
  if (!furnaceGateway) {
    throw new ApiError(httpStatus.NOT_FOUND, 'FurnaceGateway not found');
  }
  Object.assign(furnaceGateway, updateBody);
  await furnaceGateway.save();
  return furnaceGateway;
};

const deleteFurnaceGatewayById = async (furnaceGatewayId) => {
  const furnaceGateway = await getFurnaceGatewayById(furnaceGatewayId);
  if (!furnaceGateway) {
    throw new ApiError(httpStatus.NOT_FOUND, 'FurnaceGateway not found');
  }
  await furnaceGateway.remove();
  return furnaceGateway;
};

module.exports = {
  createFurnaceGateway,
  queryFurnaceGateways,
  getAllFurnaceGateways,
  getFurnaceGatewayById,
  updateFurnaceGatewayById,
  deleteFurnaceGatewayById,
};
