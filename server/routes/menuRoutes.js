// routes/menuRoutes.js

const express = require('express');
const {
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
} = require('../controllers/menuController');

const router = express.Router();

// 메뉴 관련 라우트 설정
router.get('/', getAllMenus);
router.get('/:id', getMenuById);
router.post('/', createMenu);
router.put('/:id', updateMenu);
router.delete('/:id', deleteMenu);

module.exports = router;
