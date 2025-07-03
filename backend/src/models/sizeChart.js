const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
  label: String,
  bust: Number,
  waist: Number,
  hips: Number,
  length: Number,
});

const sizeChartSchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  sizes: [sizeSchema],
});

module.exports = mongoose.model("SizeChart", sizeChartSchema);
