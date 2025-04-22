const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vendorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
  address: {
    type: String,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },
  openingHours: {
    type: String,
  },
  contactNumber: {
    type: String,
  },
  email: {
    type: String,
  },
  website: {
    type: String,
  },
  socialMedia: {
    facebook: { type: String },
    instagram: { type: String },
    whatsapp: { type: String }
  },
  deals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deal'
  }]
}, { timestamps: true });

vendorSchema.index({ location: '2dsphere' });
const Vendor = mongoose.model('Vendor', vendorSchema);
module.exports = Vendor;