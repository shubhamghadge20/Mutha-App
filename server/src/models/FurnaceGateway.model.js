const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const furnaceGatewaySchema = new mongoose.Schema({
  furnaceId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  gatewayMac: {
    type: String,
    required: true,
    trim: true,
  },
});

furnaceGatewaySchema.plugin(toJSON);
furnaceGatewaySchema.plugin(paginate);

const FurnaceGateway = mongoose.model('FurnaceGateway', furnaceGatewaySchema);

module.exports = FurnaceGateway;
