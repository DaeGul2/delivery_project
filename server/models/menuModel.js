// models/menuModel.js

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewText: {
    type: String,
    required: true,
  },
  rank: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true, // 리뷰 스키마에 timestamps 추가
});

const menuSchema = new mongoose.Schema({
  menuName: {
    type: String,
    required: true,
  },
  menuPrice: {
    type: Number,
    required: true,
  },
  menuPicturePath: {
    type: String,
  },
  isValid: {
    type: Boolean,
    default: true,
  },
  countPerMenu: {
    type: Number,
    default: 0,
  },
  menuDescription: {
    type: String,
  },
  reviews: [reviewSchema],
}, {
  timestamps: true,
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
