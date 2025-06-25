const chokidar = require('chokidar');
const path = require('path');
const { handleXmlComparison } = require('../services/xml.service');

let ioInstance;
const clients = new Map();

const registerXmlSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(' Client connected:', socket.id);

    socket.on('selectFurnace', (selectedFurnaceId) => {
      console.log(` selectFurnace: ${selectedFurnaceId}`);
      const clientData = clients.get(socket.id) || {};
      clients.set(socket.id, { ...clientData, selectedFurnaceId });
    });

    socket.on('selectProduct', (selectedProduct) => {
      console.log(` selectProduct: ${selectedProduct}`);
      const clientData = clients.get(socket.id) || {};
      clients.set(socket.id, { ...clientData, selectedProduct });
    });

    socket.on('startComparison', async ({ product, furnace }) => {
      try {
        console.log(` startComparison → Furnace: ${furnace}, Product: ${product}`);

        if (!furnace) {
          throw new Error('Furnace ID is required for XML comparison.');
        }

        const result = await handleXmlComparison(product, furnace);

        clients.set(socket.id, {
          selectedFurnaceId: furnace,
          selectedProduct: product,
        });

        socket.emit('comparisonUpdate', result);
      } catch (err) {
        console.error(' Comparison Error:', err);
        socket.emit('comparisonError', { message: err.message });
      }
    });

    socket.on('disconnect', () => {
      clients.delete(socket.id);
      console.log(' Client disconnected:', socket.id);
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
        console.log(' File added:', filePath);
        await broadcastComparisonToClients();
      }
    })
    .on('change', async (filePath) => {
      if (filePath.toLowerCase().endsWith('.xml')) {
        console.log(' File changed:', filePath);
        await broadcastComparisonToClients();
      }
    })
    .on('error', (error) => {
      console.error(' Watcher error:', error);
    })
    .on('ready', () => {
      console.log(' XML file watcher is ready.');
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
      console.error(` Error for socket ${socketId}:`, err.message);
      ioInstance.to(socketId).emit('comparisonError', { message: err.message });
    }
  }
};

module.exports = {
  registerXmlSocket,
  startFileWatcher,
};
