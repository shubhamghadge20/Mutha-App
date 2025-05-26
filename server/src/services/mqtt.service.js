const mqtt = require('mqtt');
const config = require('../config/config');
const { info, error } = require('../config/logger');

const mqttBroker = config.mqtt.mqttBroker;
const mqttPort = config.mqtt.mqttPort;
const mqttPubTopic = config.mqtt.mqttPubTopic;
const mqttSubTopic = config.mqtt.mqttSubTopic;

const mqttURIString = `mqtt://${mqttBroker}:${mqttPort}`;

const client = mqtt.connect(mqttURIString);

const mqttConnect = () => {
  client.on('connect', () => {
    client.subscribe(mqttSubTopic);
    info(`Connected to MQTT with topic ${mqttSubTopic}`);
  });
};

const getMessage = async () => {
  return await new Promise((resolve, reject) => {
    const messageHandler = (topic, message) => {
      try {
        const trimmedMsg = message.toString().trim();
        const parsedMsg = JSON.parse(trimmedMsg);
        client.removeListener('message', messageHandler);
        resolve(parsedMsg);
      } catch (err) {
        client.removeListener('message', messageHandler);
        reject(`Failed to parse message: ${err}`);
      }
    };

    client.on('message', messageHandler);
  });
};

const lock = async () => {
  const relayOn = '$IPCFG,<DEVCMD:OP=1,1 >';
  client.publish(mqttPubTopic, relayOn, { qos: 1 }, (err) => {
    if (err) {
      error('Publish error:', err);
    } else {
      info('Message sent');
    }
  });
  info(`Lock command : ${mqttPubTopic} | MSG : ${relayOn}`);
};

const unlock = async () => {
  const relayOff = '$IPCFG,<DEVCMD:OP=1,0 >';
  client.publish(mqttPubTopic, relayOff, { qos: 1 }, (err) => {
    if (err) {
      error('Publish error:', err);
    } else {
      info('Message sent');
    }
  });
  info(`Lock command : ${mqttPubTopic} | MSG : ${relayOff}`);
};

module.exports = {
  mqttConnect,
  getMessage,
  lock,
  unlock,
};
