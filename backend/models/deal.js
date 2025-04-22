const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dealSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  banner: {
    type: String
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  expireDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  }
}, { timestamps: true });

// Create compound index for efficiently finding active and featured deals
dealSchema.index({ isActive: 1, isFeatured: 1 });
// Create index for expiration date to easily find expired deals
dealSchema.index({ expireDate: 1 });

const Deal = mongoose.model('Deal', dealSchema);
module.exports = Deal;