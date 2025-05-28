const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { registerXmlSocket } = require('./sockets/xml.socket');

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');

  const httpServer = http.createServer(app);

  const io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  app.set('io', io);

  registerXmlSocket(io);
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
  });

  httpServer.listen(config.port, () => {
    logger.info(`Server listening on port ${config.port}`);
  });
});
