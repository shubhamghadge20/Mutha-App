const { compareXMLWithDB } = require('../services/xml.service');

const handleXMLCompare = async (req, res) => {
  try {
    const filePath = './data/data.xml';
    const result = await compareXMLWithDB(filePath);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error comparing XML:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  handleXMLCompare,
};
