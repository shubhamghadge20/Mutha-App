const xml2js = require('xml2js');

const parseXml = async (xml) => {
  const parser = new xml2js.Parser({ explicitArray: false });
  const parsed = await parser.parseStringPromise(xml);

  const lines = parsed.Measurement?.Lines?.Line;
  const result = [];

  const lineArray = Array.isArray(lines) ? lines : [lines];

  for (const line of lineArray) {
    const lineName = line.$.LineName;

    const lineResults = Array.isArray(line.LineResult) ? line.LineResult : [line.LineResult];

    const items = lineResults.map((res) => ({
      name: res.$.Type, // or Kind if you prefer
      value: parseFloat(res.ResultValue),
      uppertolerance: 0, // default
      lowertolerance: 0, // default
    }));

    result.push({
      name: lineName,
      items,
    });
  }

  return result;
};

module.exports = parseXml;
