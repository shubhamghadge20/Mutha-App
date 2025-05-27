const { info, error } = require('../config/logger');
const { mqttService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const lockFurnace = catchAsync(async (req, res) => {
  try {
    const io = req.app.get('io');
    if (!io) throw new Error('Socket.io instance not found');

    const message = await mqttService.getMessage();
    const relayStatus = message.data.io.op1;

    if (relayStatus === 1) {
      res.json({ message: 'Already locked' });
    } else {
      await mqttService.lock();

      io.emit('furnaceStatus', { status: 'locked' });

      res.json({ message: 'Lock command sent' });
    }
  } catch (err) {
    error(err);
    res.status(500).json({ error: err.message });
  }
});

const unlockFurnace = catchAsync(async (req, res) => {
  try {
    const io = req.app.get('io');
    if (!io) throw new Error('Socket.io instance not found');

    const message = await mqttService.getMessage();
    const relayStatus = message.data.io.op1;

    if (relayStatus === 0) {
      res.json({ message: 'Already unlocked' });
    } else {
      await mqttService.unlock();

      io.emit('furnaceStatus', { status: 'unlocked' });

      res.json({ message: 'Unlock command sent' });
    }
  } catch (err) {
    error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = {
  lockFurnace,
  unlockFurnace,
};
