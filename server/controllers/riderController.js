// controllers/riderController.js

const Rider = require('../models/riderModel');

// 모든 라이더 가져오기
const getAllRiders = async (req, res) => {
  try {
    const riders = await Rider.find();
    res.status(200).json(riders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 라이더 하나 가져오기
const getRiderById = async (req, res) => {
  try {
    const rider = await Rider.findById(req.params.id);
    if (!rider) return res.status(404).json({ message: '라이더를 찾을 수 없습니다.' });
    res.status(200).json(rider);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 새로운 라이더 생성하기
const createRider = async (req, res) => {
  const { riderName, riderNumber } = req.body;
  const rider = new Rider({
    riderName,
    riderNumber,
  });

  try {
    const newRider = await rider.save();
    res.status(201).json(newRider);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 라이더 업데이트하기
const updateRider = async (req, res) => {
  try {
    const rider = await Rider.findById(req.params.id);
    if (!rider) return res.status(404).json({ message: '라이더를 찾을 수 없습니다.' });

    Object.assign(rider, req.body);
    const updatedRider = await rider.save();
    res.status(200).json(updatedRider);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 라이더 삭제하기
const deleteRider = async (req, res) => {
    try {
      const rider = await Rider.findById(req.params.id);
      if (!rider) return res.status(404).json({ message: '라이더를 찾을 수 없습니다.' });
  
      await rider.deleteOne();
      res.status(200).json({ message: '라이더가 삭제되었습니다.' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

module.exports = {
  getAllRiders,
  getRiderById,
  createRider,
  updateRider,
  deleteRider,
};
