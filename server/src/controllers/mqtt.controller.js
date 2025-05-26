const { info, error } = require('../config/logger');
const { mqttService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const lockFurnace = catchAsync(async (req, res) => {
  try {
    const message = await mqttService.getMessage();
    const relayStatus = message.data.io.op1;
    if (relayStatus === 1) {
      res.json({ message: 'Already locked' });
    } else {
      await mqttService.lock();
      res.json({ message: 'Lock command sent' });
    }
  } catch (err) {
    error(err);
  }
});

const unlockFurnace = catchAsync(async (req, res) => {
  try {
    const message = await mqttService.getMessage();
    const relayStatus = message.data.io.op1;
    if (relayStatus === 0) {
      res.json({ message: 'Already unlocked' });
    } else {
      await mqttService.unlock();
      res.json({ message: 'Unlock command sent' });
    }
  } catch (err) {
    error(err);
  }
});

module.exports = {
  lockFurnace,
  unlockFurnace,
};
