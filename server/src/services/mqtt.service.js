// mqtt.service.js
const mqtt = require('mqtt');
const config = require('../config/config');
const { info, error } = require('../config/logger');
const { Mqtt } = require('../models/');

const mqttBroker = config.mqtt.mqttBroker;
const mqttPort = config.mqtt.mqttPort;
const mqttURIString = `mqtt://${mqttBroker}:${mqttPort}`;
const client = mqtt.connect(mqttURIString);

const mqttConnect = () => {
  client.on('connect', () => {
    client.subscribe('pub1/+/');
    info('Connected to MQTT and subscribed to pub1/+/');
  });
};

const getPubTopic = (gatewayMac) => `sub1/${gatewayMac}/`;
const getSubTopic = (gatewayMac) => `pub1/${gatewayMac}/`;

const getMessage = async (gatewayMac) => {
  const topicFilter = getSubTopic(gatewayMac);
  return await new Promise((resolve, reject) => {
    const handler = (topic, message) => {
      if (!topic.startsWith(topicFilter)) return;

      try {
        const parsed = JSON.parse(message.toString().trim());
        client.removeListener('message', handler);
        resolve(parsed);
      } catch (err) {
        client.removeListener('message', handler);
        reject(err);
      }
    };
    client.on('message', handler);
  });
};

const lock = async (gatewayMac) => {
  const msg = '$IPCFG,<DEVCMD:OP=1,1 >';
  const topic = getPubTopic(gatewayMac);
  client.publish(topic, msg, { qos: 1 }, (err) => {
    if (err) error('Publish error:', err);
    else info(`Lock sent to ${topic}`);
  });
};

const unlock = async (gatewayMac) => {
  const msg = '$IPCFG,<DEVCMD:OP=1,0 >';
  const topic = getPubTopic(gatewayMac);
  client.publish(topic, msg, { qos: 1 }, (err) => {
    if (err) error('Publish error:', err);
    else info(`Unlock sent to ${topic}`);
  });
};

const getMqttStatus = async () => {
  let doc = await Mqtt.findOne();
  if (!doc) doc = await Mqtt.create({ value: 'enabled' });
  return doc.value;
};

const enableMqtt = async () => {
  let doc = await Mqtt.findOne();
  if (doc) {
    doc.value = 'enabled';
    await doc.save();
  } else {
    await Mqtt.create({ value: 'enabled' });
  }
};

const disableMqtt = async () => {
  let doc = await Mqtt.findOne();
  if (doc) {
    doc.value = 'disabled';
    await doc.save();
  } else {
    await Mqtt.create({ value: 'disabled' });
  }
};

module.exports = {
  mqttConnect,
  lock,
  unlock,
  getMessage,
  getMqttStatus,
  enableMqtt,
  disableMqtt,
};
