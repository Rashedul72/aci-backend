const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    material: {
      type: Number,
      required: true,
    },
    barcode: {
      type: String,
      required: true,
      unique: true, // This automatically creates an index
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'Uncategorized',
      required: true,
    },
    scannedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for category queries (barcode already has unique index)
productSchema.index({ category: 1 });

module.exports = mongoose.model('Product', productSchema);

