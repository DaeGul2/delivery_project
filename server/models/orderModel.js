// models/orderModel.js

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
}, {
  _id: false,
});

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  orderList: [orderItemSchema],
  destination: {
    type: String,
    required: true,
  },
  customerNumber: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  memo: {
    type: String,
  },
  isDone: {
    type: Boolean,
    default: false,
  },
  orderNumber: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
