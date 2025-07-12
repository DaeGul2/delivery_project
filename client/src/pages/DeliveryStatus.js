import React, { useState } from 'react';
import { Container, Form, Button, Table, Alert } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

function DeliveryStatus() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [positionInfo, setPositionInfo] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setOrders([]);
    setError('');
    setPositionInfo(null);

    if (!/^\d{11}$/.test(phone)) {
      setError('올바른 11자리 번호를 입력해주세요 (예: 01012345678)');
      return;
    }

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/by-customer/${phone}`);
      setOrders(res.data);

      // 순번 API 추가
      const posRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/waiting-position/${phone}`);
      setPositionInfo(posRes.data);
    } catch (err) {
      setError('주문 내역을 찾을 수 없습니다.');
    }
  };

  return (
    <Container className="mt-4">
      <h2>배달 현황 조회</h2>
      <Form className="mb-4" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <Form.Group>
          <Form.Label>주문자 번호를 입력해주세요 (예: 01012345678)</Form.Label>
          <Form.Control
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            maxLength={11}
            placeholder="01012345678"
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-2">조회</Button>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      {orders.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>주문번호</th>
              <th>주문시각</th>
              <th>메뉴</th>
              <th>총가격</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.orderNumber}>
                <td>{order.orderNumber}</td>
                <td>{moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}</td>
                <td>
                  {order.orderList.map(item => (
                    <div key={item.menuName}>{item.menuName} - {item.count}개</div>
                  ))}
                </td>
                <td>{order.totalPrice.toLocaleString()}원</td>
                <td>
                  {order.isDone ? (
                    '배달 완료'
                  ) : (
                    <>
                      배달 준비 중{' '}
                      {positionInfo && positionInfo.orderId === order._id && (
                        <span style={{
                          backgroundColor: '#ffe0e0',
                          color: 'red',
                          fontWeight: 'bold',
                          padding: '2px 6px',
                          borderRadius: '5px',
                          marginLeft: '6px'
                        }}>
                          (현재 {positionInfo.position}번 순)
                        </span>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

     
    </Container>
  );
}

export default DeliveryStatus;
