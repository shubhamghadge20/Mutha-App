const chokidar = require('chokidar');
const path = require('path');
const { handleXmlComparison } = require('../services/xml.service');

let ioInstance;
const clients = new Map();

const registerXmlSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle furnace selection
    socket.on('selectFurnace', (selectedFurnaceId) => {
      const clientData = clients.get(socket.id) || {};
      clients.set(socket.id, { ...clientData, selectedFurnaceId });
    });

    // Handle product selection
    socket.on('selectProduct', (selectedProduct) => {
      const clientData = clients.get(socket.id) || {};
      clients.set(socket.id, { ...clientData, selectedProduct });
    });

    // Start comparison
    socket.on('startComparison', async () => {
      try {
        const { selectedProduct, selectedFurnaceId } = clients.get(socket.id) || {};

        if (!selectedFurnaceId) {
          throw new Error('Furnace ID is required for XML comparison.');
        }

        const result = await handleXmlComparison(selectedProduct, selectedFurnaceId);
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
    .on('error', (error) => {
      console.error('Watcher error:', error);
    })
    .on('ready', () => {
      console.log('XML file watcher is ready.');
    });
};

const broadcastComparisonToClients = async () => {
  if (!ioInstance) return;

  for (const [socketId, clientData] of clients.entries()) {
    const { selectedProduct, selectedFurnaceId } = clientData;

    if (!selectedFurnaceId) {
      ioInstance.to(socketId).emit('comparisonError', {
        message: 'Furnace ID is required for XML comparison.',
      });
      continue;
    }

    try {
      const result = await handleXmlComparison(selectedProduct, selectedFurnaceId);
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
