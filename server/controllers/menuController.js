// controllers/menuController.js

const Menu = require('../models/menuModel');
const path = require('path');

// 모든 메뉴 가져오기
const getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.status(200).json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 메뉴 하나 가져오기
const getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: '메뉴를 찾을 수 없습니다.' });
    res.status(200).json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 새로운 메뉴 생성하기
const createMenu = async (req, res) => {
  const { menuName, menuPrice, isValid, countPerMenu, menuDescription, reviews } = req.body;
  const menuPicturePath = req.file ? `/uploads/${req.file.filename}` : null;

  const menu = new Menu({
    menuName,
    menuPrice,
    menuPicturePath,
    isValid,
    countPerMenu,
    menuDescription,
    reviews
  });

  try {
    const newMenu = await menu.save();
    res.status(201).json(newMenu);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 메뉴 업데이트하기
const updateMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: '메뉴를 찾을 수 없습니다.' });

    const menuPicturePath = req.file ? `/uploads/${req.file.filename}` : menu.menuPicturePath;
    Object.assign(menu, req.body, { menuPicturePath });

    const updatedMenu = await menu.save();
    res.status(200).json(updatedMenu);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 메뉴 삭제하기
const deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: '메뉴를 찾을 수 없습니다.' });

    await Menu.deleteOne({ _id: req.params.id }); // ✅ 안전한 방식
    res.status(200).json({ message: '메뉴가 삭제되었습니다.' });
  } catch (err) {
    console.error(err); // 디버깅 로그 추가
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
};
