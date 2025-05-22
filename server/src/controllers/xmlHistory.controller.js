const { fetchHistory } = require('../services/xmlHistory.service');

const getXmlComparisonHistory = async (req, res) => {
  const { product } = req.query;
  const history = await fetchHistory(product);
  res.send(history);
};

module.exports = {
  getXmlComparisonHistory,
};
