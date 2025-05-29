const chokidar = require('chokidar');
const path = require('path');
const { handleXmlComparison } = require('../services/xml.service');

let ioInstance;
const clients = new Map();

const registerXmlSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('selectProduct', (selectedProduct) => {
      clients.set(socket.id, selectedProduct);
    });

    socket.on('startComparison', async (selectedProduct) => {
      try {
        clients.set(socket.id, selectedProduct);
        const result = await handleXmlComparison(selectedProduct);
        socket.emit('comparisonUpdate', result);
      } catch (err) {
        console.error(err);
        socket.emit('comparisonError', { message: err.message });
      }
    });

    socket.on('disconnect', () => {
      clients.delete(socket.id);
      console.log('Client disconnected:', socket.id);
    });
  });

  startFileWatcher();
};

const startFileWatcher = () => {
  const folder = path.resolve(process.env.XML_FOLDER_PATH || 'C:/Users/SHUBHAM/Downloads/check');

  const watcher = chokidar.watch(folder, {
    persistent: true,
    ignoreInitial: false,
    awaitWriteFinish: {
      stabilityThreshold: 1000,
      pollInterval: 100,
    },
  });

  watcher
    .on('add', async (filePath) => {
      if (filePath.toLowerCase().endsWith('.xml')) {
        await broadcastComparisonToClients();
      }
    })
    .on('change', async (filePath) => {
      if (filePath.toLowerCase().endsWith('.xml')) {
        await broadcastComparisonToClients();
      }
    })
    .on('error', (error) => {})
    .on('ready', () => {});
};

const broadcastComparisonToClients = async () => {
  if (!ioInstance) return;

  for (const [socketId, selectedProduct] of clients.entries()) {
    try {
      const result = await handleXmlComparison(selectedProduct);
      ioInstance.to(socketId).emit('comparisonUpdate', result);
    } catch (err) {
      ioInstance.to(socketId).emit('comparisonError', { message: err.message });
    }
  }
};

module.exports = {
  registerXmlSocket,
  startFileWatcher,
};
