// homepageSectionModel.js
const mongoose = require('mongoose');

const homepageSectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  label: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    required: true,
  },
  productsToShow: {
    type: Number,
    default: 10,
  },
  colorPriority: {
    type: [String],
    default: [],
    description: 'Array of colors in priority order. Products with these colors will appear first.'
  },
}, {
  timestamps: true,
});

// Ensure unique order values
homepageSectionSchema.index({ order: 1 }, { unique: true });

const HomepageSection = mongoose.model('HomepageSection', homepageSectionSchema);

module.exports = HomepageSection;
