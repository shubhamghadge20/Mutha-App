const { info, error } = require('../config/logger');
const { mqttService } = require('../services');
const { getMqttStatus } = require('../services/mqtt.service');
const catchAsync = require('../utils/catchAsync');

const lockFurnace = catchAsync(async (req, res) => {
  try {
    const mqttStatus = await getMqttStatus();

    if (mqttStatus !== 'enabled') {
      return res.status(403).json({ message: 'MQTT is disabled. Lock operation not allowed.' });
    }
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

const enableMqttController = async (req, res) => {
  try {
    await mqttService.enableMqtt();
    res.status(200).json({ message: 'MQTT status set to enabled' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to enable MQTT', error: err.message });
  }
};

const disableMqttController = async (req, res) => {
  try {
    await mqttService.unlock();
    await mqttService.disableMqtt();
    res.status(200).json({ message: 'MQTT status set to disabled' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to disable MQTT', error: err.message });
  }
};

const getMqttStatusController = async (req, res) => {
  try {
    const status = await mqttService.getMqttStatus();
    res.status(200).json({ status });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get MQTT status', error: err.message });
  }
};

module.exports = {
  lockFurnace,
  unlockFurnace,
  enableMqttController,
  disableMqttController,
  getMqttStatusController,
};
