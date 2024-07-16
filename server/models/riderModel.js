// models/riderModel.js

const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
  riderName: {
    type: String,
    required: true,
  },
  riderNumber: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

const Rider = mongoose.model('Rider', riderSchema);

module.exports = Rider;
