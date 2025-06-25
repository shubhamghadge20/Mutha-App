const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const { getAllProducts } = require('./product.service');
const { getLatestXmlFile } = require('../utils/file.utils');
const XmlComparison = require('../models/xmlComparison.model');
const { getMqttStatus } = require('./mqtt.service');

const parseXml = (filePath) => {
  const xml = fs.readFileSync(filePath, 'utf-8');
  return xml2js.parseStringPromise(xml);
};

const extractReportedElements = (elements = []) =>
  elements
    .filter((e) => e?.ElementResult?.some((r) => r.$?.StatType === 'Reported'))
    .map((e) => {
      const name = e?.$?.ElementName;
      const reportedResult = e.ElementResult.find((r) => r.$?.StatType === 'Reported');
      const value = parseFloat(parseFloat(reportedResult?.ResultValue?.[0]).toFixed(5));
      return { itemName: name, resultValue: value };
    });

const compareWithDatabase = async (xmlElements, selectedProductName) => {
  const allProducts = await getAllProducts();
  const selectedProduct = allProducts.find((p) => p.name === selectedProductName);
  if (!selectedProduct) throw new Error(`Product '${selectedProductName}' not found`);

  return xmlElements
    .map((xmlItem) => {
      const match = selectedProduct.items.find((item) => item.name === xmlItem.itemName);
      if (!match) return null;
      const inTolerance = xmlItem.resultValue >= match.lowertolerance && xmlItem.resultValue <= match.uppertolerance;
      return {
        itemName: xmlItem.itemName,
        resultValue: xmlItem.resultValue,
        lowertolerance: match.lowertolerance,
        uppertolerance: match.uppertolerance,
        inTolerance,
      };
    })
    .filter(Boolean);
};

const comparisonCache = {
  lastComparedFile: null,
  lastModifiedTime: null,
  lastSelectedProduct: null,
  lastSelectedFurnace: null,
  lastComparisonResult: null,
  processedFurnaces: new Set(),
  unlockedFurnaces: new Set(),
};

const handleXmlComparison = async (selectedProductName, selectedFurnaceId) => {
  console.log(' Furnace ID from frontend:', selectedFurnaceId);

  if (!selectedFurnaceId) throw new Error('Furnace ID is required.');
  if (!selectedProductName) throw new Error('Product name is required.');

  const folderPath = process.env.XML_FOLDER_PATH;
  if (!folderPath) throw new Error('XML_FOLDER_PATH is not set');
  const folder = path.resolve(folderPath);

  const latestFile = getLatestXmlFile(folder);
  if (!latestFile) {
    return {
      latestFile: null,
      comparisonResults: [],
      selectedProduct: selectedProductName,
      selectedFurnace: selectedFurnaceId,
      sampleName: 'No File Found',
      date: new Date().toISOString(),
    };
  }

  const stats = fs.statSync(latestFile);
  const fileModifiedTime = stats.mtimeMs;

  const {
    lastComparedFile,
    lastModifiedTime: cachedTime,
    lastSelectedProduct,
    lastSelectedFurnace,
    lastComparisonResult,
    processedFurnaces,
    unlockedFurnaces,
  } = comparisonCache;

  const isSameFile = latestFile === lastComparedFile && fileModifiedTime === cachedTime;
  const isSameProduct = selectedProductName === lastSelectedProduct;
  const isSameFurnace = selectedFurnaceId === lastSelectedFurnace;
  const hasSeenFurnace = processedFurnaces.has(selectedFurnaceId);
  const hasUnlockedFurnace = unlockedFurnaces.has(selectedFurnaceId);

  if (!isSameFile) {
    comparisonCache.processedFurnaces = new Set();
    comparisonCache.unlockedFurnaces = new Set();
    return await performComparison(latestFile, selectedProductName, selectedFurnaceId, fileModifiedTime);
  }

  if (isSameFile && isSameProduct && isSameFurnace) {
    return {
      ...JSON.parse(JSON.stringify(lastComparisonResult)),
      selectedFurnace: selectedFurnaceId,
      selectedProduct: selectedProductName,
      message: 'Same file, same product, same furnace → Skipped (cached)',
      skip: true,
    };
  }

  if (isSameFile && isSameProduct && !hasSeenFurnace) {
    comparisonCache.processedFurnaces.add(selectedFurnaceId);
    comparisonCache.unlockedFurnaces.add(selectedFurnaceId);
    return {
      ...JSON.parse(JSON.stringify(lastComparisonResult)),
      selectedFurnace: selectedFurnaceId,
      selectedProduct: selectedProductName,
      lockStatus: 'Unlocked',
      message: 'Same file, same product, new furnace → Unlocked',
      skip: true,
    };
  }

  if (isSameFile && hasUnlockedFurnace) {
    if (!hasSeenFurnace) {
      comparisonCache.processedFurnaces.add(selectedFurnaceId);
    }
    return {
      ...JSON.parse(JSON.stringify(lastComparisonResult)),
      selectedFurnace: selectedFurnaceId,
      selectedProduct: selectedProductName,
      lockStatus: 'Unlocked',
      message: 'Same file, furnace was previously unlocked → Keep Unlocked',
      skip: true,
    };
  }

  return await performComparison(latestFile, selectedProductName, selectedFurnaceId, fileModifiedTime);
};

const performComparison = async (filePath, product, furnace, modifiedTime) => {
  const parsed = await parseXml(filePath);

  const sampleIDs = parsed?.SampleResults?.SampleResult?.[0]?.SampleIDs?.[0]?.SampleID || [];

  const sampleIdBlock = sampleIDs.find((id) => id?.IDName?.[0] === 'Sample Name');
  const sampleName = sampleIdBlock?.IDValue?.[0]?.trim() || 'Unknown Sample';

  const elements =
    parsed?.SampleResults?.SampleResult?.[0]?.MeasurementStatistics?.[0]?.Measurement?.[0]?.Elements?.[0]?.Element || [];

  const reportedElements = extractReportedElements(elements);
  const comparisonResults = await compareWithDatabase(reportedElements, product);
  const mqttStatus = await getMqttStatus();

  const lockStatus =
    mqttStatus === 'enabled' ? (comparisonResults.every((r) => r.inTolerance) ? 'Unlocked' : 'Locked') : 'Lock disabled';

  const result = {
    latestFile: path.basename(filePath),
    selectedProduct: product,
    selectedFurnace: furnace,
    sampleName,
    comparisonResults,
    lockStatus,
    date: Date.now(),
  };

  await XmlComparison.create(result);

  comparisonCache.lastComparedFile = filePath;
  comparisonCache.lastModifiedTime = modifiedTime;
  comparisonCache.lastSelectedProduct = product;
  comparisonCache.lastSelectedFurnace = furnace;
  comparisonCache.lastComparisonResult = result;
  comparisonCache.processedFurnaces.add(furnace);

  return result;
};

module.exports = {
  handleXmlComparison,
};
