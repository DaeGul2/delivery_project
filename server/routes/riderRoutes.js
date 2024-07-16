// routes/riderRoutes.js

const express = require('express');
const {
  getAllRiders,
  getRiderById,
  createRider,
  updateRider,
  deleteRider,
} = require('../controllers/riderController');

const router = express.Router();

// 라이더 관련 라우트 설정
router.get('/', getAllRiders);
router.get('/:id', getRiderById);
router.post('/', createRider);
router.put('/:id', updateRider);
router.delete('/:id', deleteRider);

module.exports = router;
