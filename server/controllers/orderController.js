// controllers/orderController.js

const Order = require('../models/orderModel');
const Menu = require('../models/menuModel');
const Rider = require('../models/riderModel');
const msgModule = require('coolsms-node-sdk').default;
const dotenv = require('dotenv');

dotenv.config();

const apiKey = process.env.apiKey;
const apiSecret = process.env.apiSecret;
const messageService = new msgModule(apiKey, apiSecret);

const createOrder = async (req, res) => {
  const { customerName, orderList, destination, customerNumber, memo } = req.body;

  // 특수문자 제거 및 memo 길이 제한
  const cleanMemo = memo.replace(/[^\w\s]/gi, '').slice(0, 20);

  // totalPrice 계산
  let totalPrice = 0;
  for (const item of orderList) {
    const menu = await Menu.findById(item.menuId);
    if (!menu) return res.status(400).json({ message: `메뉴를 찾을 수 없습니다: ${item.menuId}` });
    totalPrice += menu.menuPrice * item.count;
  }

  // 모든 라이더들의 정보 가져오기
  const riders = await Rider.find();
  const riderNumbers = riders.map(rider => rider.riderNumber);

  // 주문번호 계산
  const orderCount = await Order.countDocuments();
  const orderNumber = orderCount + 1;

  // 주문 내역 텍스트 작성
  const orderDic = {};
  for (const item of orderList) {
    const menu = await Menu.findById(item.menuId);
    orderDic[menu.menuName] = item.count;
  }

  const orderText = `주문번호 : ${orderNumber}\n주문자 이름 : ${customerName}\n주문 내역 : ${Object.entries(orderDic).map(([key, value]) => `${key} - ${value}개`).join(', ')}\n주문장소 : ${destination}\n주문자 번호 : ${customerNumber}\n전체 가격 : ${totalPrice}`;
  // const orderText = '메시지테스트';
  // 메시지 전송 파라미터 준비
  const params = riderNumbers.map(riderNumber => ({
    text: orderText,
    to: riderNumber,
    from: customerNumber,
  }));

  // 메시지 전송
  try {
    await messageService.sendMany(params);
  } catch (error) {
    return res.status(500).json({ message: '메시지 전송에 실패했습니다.', error });
  }


  console.log("orderlist: ",orderList);


  // 주문 저장
  const order = new Order({
    customerName,
    orderList,
    destination,
    customerNumber,
    totalPrice,
    memo: cleanMemo,
    isDone: false,
    orderNumber,
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    // 주문 목록을 불러오고 orderList.menuId를 populate
    const orders = await Order.find().populate('orderList.menuId');

    // 주문 목록을 변환하여 orderList에 menuName을 추가
    const ordersWithMenuNames = orders.map(order => {
      const orderListWithNames = order.orderList.map(item => {
        return {
          ...item._doc,
          menuName: item.menuId.menuName, // menuId가 populate 되어 있으므로 menuName을 추가
        };
      });
      return {
        ...order._doc,
        orderList: orderListWithNames,
      };
    });

    res.status(200).json(ordersWithMenuNames);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 주문 하나 가져오기
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('orderList.menuId');
    if (!order) return res.status(404).json({ message: '주문을 찾을 수 없습니다.' });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 주문 업데이트하기
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: '주문을 찾을 수 없습니다.' });

    Object.assign(order, req.body);
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 주문 삭제하기
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: '주문을 찾을 수 없습니다.' });

    await order.deleteOne();
    res.status(200).json({ message: '주문이 삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
