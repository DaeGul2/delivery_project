// routes/orderRoutes.js

const express = require('express');
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByCustomerNumber,
  getWaitingOrderPosition
} = require('../controllers/orderController');

const router = express.Router();

// 주문 관련 라우트 설정
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);
router.get('/by-customer/:number', getOrdersByCustomerNumber);
router.get('/waiting-position/:number', getWaitingOrderPosition);

module.exports = router;
