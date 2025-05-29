const mongoose = require('mongoose');

const mqttSchema = mongoose.Schema({
  value: {
    type: String,
    required: true,
    enum: ['enabled', 'disabled'],
    default: 'enabled',
  },
});
const Mqtt = mongoose.model('Mqtt', mqttSchema);

module.exports = Mqtt;
