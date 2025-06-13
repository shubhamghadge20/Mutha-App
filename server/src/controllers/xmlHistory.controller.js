const { fetchHistory, deleteHistoryById } = require('../services/xmlHistory.service');

const getXmlComparisonHistory = async (req, res) => {
  const { product, page, limit, startTime, endTime } = req.query;

  try {
    const history = await fetchHistory(product, parseInt(page), parseInt(limit), startTime, endTime);
    res.send(history);
  } catch (error) {
    res.status(500).send({
      message: 'Failed to fetch history',
      error: error.message,
    });
  }
};

const deleteXmlComparisonHistory = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await deleteHistoryById(id);
    if (!deleted) {
      return res.status(404).send({ message: 'Record not found' });
    }
    res.send({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Failed to delete record', error: error.message });
  }
};

module.exports = {
  getXmlComparisonHistory,
  deleteXmlComparisonHistory,
};
