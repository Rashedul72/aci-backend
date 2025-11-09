const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure "Uncategorized" category always exists
categorySchema.statics.ensureUncategorized = async function () {
  const uncategorized = await this.findOne({ name: 'Uncategorized' });
  if (!uncategorized) {
    await this.create({ name: 'Uncategorized' });
  }
};

module.exports = mongoose.model('Category', categorySchema);

