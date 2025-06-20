const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const { furnaceGatewayService } = require('../services');

const createFurnaceGateway = catchAsync(async (req, res) => {
  const furnaceGateway = await furnaceGatewayService.createFurnaceGateway(req.body);
  res.status(httpStatus.CREATED).send(furnaceGateway);
});

const getFurnaceGateways = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['furnaceId', 'gatewayMac']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await furnaceGatewayService.queryFurnaceGateways(filter, options);
  res.send(result);
});

const getFurnaceGateway = catchAsync(async (req, res) => {
  const furnaceGateway = await furnaceGatewayService.getFurnaceGatewayById(req.params.furnaceGatewayId);
  if (!furnaceGateway) {
    throw new ApiError(httpStatus.NOT_FOUND, 'FurnaceGateway not found');
  }
  res.send(furnaceGateway);
});

const updateFurnaceGateway = catchAsync(async (req, res) => {
  const furnaceGateway = await furnaceGatewayService.updateFurnaceGatewayById(req.params.furnaceGatewayId, req.body);
  res.send(furnaceGateway);
});

const deleteFurnaceGateway = catchAsync(async (req, res) => {
  await furnaceGatewayService.deleteFurnaceGatewayById(req.params.furnaceGatewayId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createFurnaceGateway,
  getFurnaceGateways,
  getFurnaceGateway,
  updateFurnaceGateway,
  deleteFurnaceGateway,
};
