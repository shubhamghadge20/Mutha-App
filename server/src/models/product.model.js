const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    items: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          value: {
            type: Number,
            required: true,
          },
          uppertolerance: {
            type: Number,
            required: true,
          },
          lowertolerance: {
            type: Number,
            required: true,
          },
        },
      ],
      required: true,
    },
  },
  {
    _id: true,
  }
);

productSchema.plugin(toJSON);
productSchema.plugin(paginate);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
