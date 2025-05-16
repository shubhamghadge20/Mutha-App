const fs = require('fs');
const xml2js = require('xml2js');
const util = require('util');
const Product = require('../models/product.model');

const parseString = util.promisify(new xml2js.Parser().parseString);

const compareXMLWithDB = async (filePath) => {
  const xmlData = fs.readFileSync(filePath, 'utf-8');
  const result = await parseString(xmlData);

  const products = await Product.find({});

  const lines =
    result?.SampleResults?.SampleResult?.[0]?.MeasurementReplicates?.[0]?.MeasurementReplicate?.[0]?.Measurement?.[0]
      ?.Lines?.[0]?.Line || [];

  const differences = [];

  for (const product of products) {
    // Find the Line in XML that matches product.name
    const line = lines.find((l) => l.$?.LineName === product.name);

    if (!line) {
      // If product line not found in XML, push all items with status Line Not Found
      for (const item of product.items) {
        differences.push({
          productName: product.name,
          itemName: item.name,
          dbValue: item.value,
          xmlValue: null,
          difference: null,
          status: 'Line Not Found in XML',
        });
      }
      continue; // Move to next product
    }

    // Now compare each item inside product with XML line results
    for (const item of product.items) {
      const dbValue = item.value;

      // Find the lineResult matching item.name to lineResult.$.Type
      const resultObj = line.LineResult?.find((r) => r.$?.Type === item.name);

      if (!resultObj || !resultObj.ResultValue?.[0]) {
        differences.push({
          productName: product.name,
          itemName: item.name,
          dbValue,
          xmlValue: null,
          difference: null,
          status: 'Result Value Not Found',
        });
        continue;
      }

      const xmlValue = parseFloat(resultObj.ResultValue[0]);

      differences.push({
        productName: product.name,
        itemName: item.name,
        dbValue,
        xmlValue,
        difference: parseFloat((xmlValue - dbValue).toFixed(3)),
        status: dbValue === xmlValue ? 'Match' : 'Mismatch',
      });
    }
  }

  return differences;
};

module.exports = { compareXMLWithDB };
