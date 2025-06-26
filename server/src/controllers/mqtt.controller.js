const { info, error } = require('../config/logger');
const { mqttService } = require('../services');
const { getMqttStatus } = require('../services/mqtt.service');
const catchAsync = require('../utils/catchAsync');

const lockFurnace = catchAsync(async (req, res) => {
  try {
    const { gatewayMac } = req.query;
    if (!gatewayMac) return res.status(400).json({ message: 'Missing gatewayMac' });

    const mqttStatus = await getMqttStatus();
    if (mqttStatus !== 'enabled') {
      return res.status(403).json({ message: 'MQTT is disabled. Lock operation not allowed.' });
    }

    const io = req.app.get('io');
    if (!io) throw new Error('Socket.io instance not found');

    const message = await mqttService.getMessage(gatewayMac);
    const relayStatus = message?.data?.io?.op1;

    await mqttService.lock(gatewayMac);
    io.emit('furnaceStatus', { gatewayMac, status: 'locked' });

    if (relayStatus === 1) {
      res.json({ message: 'Already locked, but LOCK command sent again' });
    } else {
      res.json({ message: 'Lock command sent' });
    }
  } catch (err) {
    error(err);
    res.status(500).json({ error: err.message });
  }
});

const unlockFurnace = catchAsync(async (req, res) => {
  try {
    const { gatewayMac } = req.query;
    if (!gatewayMac) return res.status(400).json({ message: 'Missing gatewayMac' });

    const io = req.app.get('io');
    if (!io) throw new Error('Socket.io instance not found');

    const message = await mqttService.getMessage(gatewayMac);
    const relayStatus = message?.data?.io?.op1;

    await mqttService.unlock(gatewayMac);
    io.emit('furnaceStatus', { gatewayMac, status: 'unlocked' });

    if (relayStatus === 0) {
      res.json({ message: 'Already unlocked, but UNLOCK command sent again' });
    } else {
      res.json({ message: 'Unlock command sent' });
    }
  } catch (err) {
    error(err);
    res.status(500).json({ error: err.message });
  }
});

const enableMqttController = catchAsync(async (req, res) => {
  try {
    await mqttService.enableMqtt();
    res.status(200).json({ message: 'MQTT status set to enabled' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to enable MQTT', error: err.message });
  }
});

const disableMqttController = catchAsync(async (req, res) => {
  try {
    const { gatewayMac } = req.query;
    if (gatewayMac) await mqttService.unlock(gatewayMac); // Optional auto-unlock
    await mqttService.disableMqtt();
    res.status(200).json({ message: 'MQTT status set to disabled' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to disable MQTT', error: err.message });
  }
});

const getMqttStatusController = catchAsync(async (req, res) => {
  try {
    const status = await mqttService.getMqttStatus();
    res.status(200).json({ status });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get MQTT status', error: err.message });
  }
});

module.exports = {
  lockFurnace,
  unlockFurnace,
  enableMqttController,
  disableMqttController,
  getMqttStatusController,
};
