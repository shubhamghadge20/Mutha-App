const mongoose = require('mongoose');

const comparisonItemSchema = new mongoose.Schema({
  itemName: String,
  resultValue: Number,
  lowertolerance: Number,
  uppertolerance: Number,
  inTolerance: Boolean,
});

const xmlComparisonSchema = new mongoose.Schema({
  latestFile: String,
  selectedProduct: String,
  sampleName: String,
  date: Date,
  comparisonResults: [comparisonItemSchema],
});

module.exports = mongoose.model('XmlComparison', xmlComparisonSchema);
