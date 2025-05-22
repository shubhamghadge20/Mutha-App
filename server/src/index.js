const mongoose = require('mongoose');
const http = require('http');

const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');

  const httpServer = http.createServer(app);

  httpServer.listen(config.port, () => {
    logger.info(`Server listening on port ${config.port}`);
  });
});
