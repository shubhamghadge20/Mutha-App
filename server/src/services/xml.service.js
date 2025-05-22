const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const { getAllProducts } = require('./product.service');
const { getLatestXmlFile } = require('../utils/file.utils');
const XmlComparison = require('../models/xmlComparison.model');

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
      const value = parseFloat(reportedResult?.ResultValue?.[0]);
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

const handleXmlComparison = async (selectedProductName) => {
  const folder = path.resolve(process.env.XML_FOLDER_PATH || 'C:/Users/SHUBHAM/Downloads/check');
  const latestFile = getLatestXmlFile(folder);
  if (!latestFile) {
    return {
      latestFile: null,
      comparisonResults: [],
      sampleName: 'No File Found',
      selectedProduct: selectedProductName,
      date: new Date().toISOString(),
    };
  }

  const parsed = await parseXml(latestFile);
  const sampleIDs = parsed?.SampleResults?.SampleResult?.[0]?.SampleIDs?.[0]?.SampleID || [];
  const sampleIdBlock = sampleIDs.find((id) => id?.IDName?.[0] === 'Sample Name');
  const sampleName = sampleIdBlock?.IDValue?.[0]?.trim() || 'Unknown Sample';

  const elements =
    parsed?.SampleResults?.SampleResult?.[0]?.MeasurementStatistics?.[0]?.Measurement?.[0]?.Elements?.[0]?.Element || [];

  const reportedElements = extractReportedElements(elements);
  const comparisonResults = await compareWithDatabase(reportedElements, selectedProductName);
  const comparisonDate = new Date().toISOString();

  await XmlComparison.create({
    latestFile: path.basename(latestFile),
    selectedProduct: selectedProductName,
    sampleName,
    comparisonResults,
    date: comparisonDate,
  });

  return {
    latestFile: path.basename(latestFile),
    selectedProduct: selectedProductName,
    sampleName,
    comparisonResults,
    date: comparisonDate,
  };
};

module.exports = {
  handleXmlComparison,
};
