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
};

const handleXmlComparison = async (selectedProductName, selectedFurnaceId) => {
  if (!selectedFurnaceId) {
    throw new Error('Furnace ID is required for XML comparison.');
  }

  if (!selectedProductName) {
    throw new Error('Product name is required for XML comparison.');
  }

  const folderPath = process.env.XML_FOLDER_PATH;
  if (!folderPath) {
    throw new Error('XML_FOLDER_PATH environment variable is not set.');
  }

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
  const lastModifiedTime = stats.mtimeMs;

  if (
    comparisonCache.lastComparedFile === latestFile &&
    comparisonCache.lastModifiedTime === lastModifiedTime &&
    comparisonCache.lastSelectedProduct === selectedProductName &&
    comparisonCache.lastSelectedFurnace === selectedFurnaceId
  ) {
    return comparisonCache.lastComparisonResult;
  }

  const parsed = await parseXml(latestFile);
  const sampleIDs = parsed?.SampleResults?.SampleResult?.[0]?.SampleIDs?.[0]?.SampleID || [];
  const sampleIdBlock = sampleIDs.find((id) => id?.IDName?.[0] === 'Sample Name');
  const sampleName = sampleIdBlock?.IDValue?.[0]?.trim() || 'Unknown Sample';

  const elements =
    parsed?.SampleResults?.SampleResult?.[0]?.MeasurementStatistics?.[0]?.Measurement?.[0]?.Elements?.[0]?.Element || [];

  const reportedElements = extractReportedElements(elements);
  const comparisonResults = await compareWithDatabase(reportedElements, selectedProductName);
  const mqttStatus = await getMqttStatus();

  const lockStatus =
    mqttStatus === 'enabled' ? (comparisonResults.every((r) => r.inTolerance) ? 'Unlocked' : 'Locked') : 'Lock disabled';

  const resultToReturn = {
    latestFile: path.basename(latestFile),
    selectedProduct: selectedProductName,
    selectedFurnace: selectedFurnaceId,
    sampleName,
    comparisonResults,
    lockStatus,
    date: Date.now(),
  };

  await XmlComparison.create({
    latestFile: path.basename(latestFile),
    selectedProduct: selectedProductName,
    selectedFurnace: selectedFurnaceId,
    sampleName,
    comparisonResults,
    lockStatus,
    date: Date.now(),
  });

  comparisonCache.lastComparedFile = latestFile;
  comparisonCache.lastModifiedTime = lastModifiedTime;
  comparisonCache.lastSelectedProduct = selectedProductName;
  comparisonCache.lastSelectedFurnace = selectedFurnaceId;
  comparisonCache.lastComparisonResult = resultToReturn;

  return resultToReturn;
};

module.exports = {
  handleXmlComparison,
};
