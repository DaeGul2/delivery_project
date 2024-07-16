// src/pages/SalesManagement.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Modal, Table } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

function SalesManagement() {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [salesStatistics, setSalesStatistics] = useState([]);

  useEffect(() => {
    // Fetch orders from the server
    axios.get(`${process.env.REACT_APP_API_URL}/api/orders`)
      .then(response => {
        // 주문 시각 기준으로 가장 최근 주문이 위로 오도록 정렬
        const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
      })
      .catch(error => {
        console.error('There was an error fetching the orders!', error);
      });
  }, []);

  const handleStatusUpdate = (orderId, newStatus) => {
    axios.put(`${process.env.REACT_APP_API_URL}/api/orders/${orderId}`, { isDone: newStatus })
      .then(response => {
        setOrders(orders.map(order => order._id === orderId ? { ...order, isDone: newStatus, updatedAt: new Date() } : order));
        alert('Order status updated successfully');
      })
      .catch(error => {
        console.error('There was an error updating the order status!', error);
        alert('Failed to update order status');
      });
  };

  const calculateSalesStatistics = () => {
    const stats = {};
    orders.forEach(order => {
      order.orderList.forEach(item => {
        if (!stats[item.menuName]) {
          stats[item.menuName] = { count: 0, total: 0 };
        }
        stats[item.menuName].count += item.count;
        stats[item.menuName].total += item.count * item.price;
      });
    });
    const statsArray = Object.keys(stats).map(menuName => ({
      menuName,
      count: stats[menuName].count,
      total: stats[menuName].total,
    }));
    setSalesStatistics(statsArray);
    setShowModal(true);
  };

  return (
    <Container>
      <h1 className="mt-4">Sales Management</h1>
      <Button variant="info" className="mb-4" onClick={calculateSalesStatistics}>
        판매 통계보기
      </Button>
      <Row className="mt-4">
        {orders.map(order => (
          <Col key={order._id} sm={12} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>주문번호: {order.orderNumber}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">고객명: {order.customerName}</Card.Subtitle>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>내역: </strong> 
                    {order.orderList.map(item => (
                      <div key={item.menuName}>{item.menuName} {item.count}개</div>
                    ))}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>배달 장소: </strong> {order.destination}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>합계: </strong> {order.totalPrice}원
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>주문시간: </strong> {moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>출발시간: </strong> {order.isDone ? moment(order.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '출발 전'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>상태: </strong> {order.isDone ? '배달 완료' : '배달 전'}
                  </ListGroup.Item>
                </ListGroup>
                <Button
                  variant={order.isDone ? 'success' : 'danger'}
                  onClick={() => handleStatusUpdate(order._id, !order.isDone)}
                  className="mt-3"
                >
                  {order.isDone ? '배달 완료' : '배달 전'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>판매 통계</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>메뉴 이름</th>
                <th>판매 개수</th>
                <th>총 수익</th>
              </tr>
            </thead>
            <tbody>
              {salesStatistics.map(stat => (
                <tr key={stat.menuName}>
                  <td>{stat.menuName}</td>
                  <td>{stat.count}</td>
                  <td>{stat.total}원</td>
                </tr>
              ))}
              <tr>
                <td><strong>총 판매 개수</strong></td>
                <td colSpan="2"><strong>{salesStatistics.reduce((acc, stat) => acc + stat.count, 0)}개</strong></td>
              </tr>
              <tr>
                <td><strong>총 수익</strong></td>
                <td colSpan="2"><strong>{salesStatistics.reduce((acc, stat) => acc + stat.total, 0)}원</strong></td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default SalesManagement;
