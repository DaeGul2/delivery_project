// src/pages/MenuOrder.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUtensils } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function MenuOrder() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState({ name: '', contact: '', message: '', location: '' });
  const [errors, setErrors] = useState({ name: '', contact: '', location: '' });

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/menus`)
      .then(response => setMenuItems(response.data))
      .catch(error => console.error('There was an error fetching the menu data!', error));
  }, []);

  const handleAddToCart = (item, quantity) => {
    const existingItem = cart.find(cartItem => cartItem.menuName === item.menuName);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.menuName === item.menuName
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity }]);
    }
  };

  const handleRemoveFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleOrder = async () => {
    if (cart.length === 0) {
      alert('장바구니가 비어 있습니다. 주문할 항목을 추가해주세요.');
      return;
    }

    const orderData = {
      customerName: orderDetails.name,
      orderList: cart.map(item => ({
        menuId: item._id,
        count: item.quantity,
        price: item.menuPrice
      })),
      destination: orderDetails.location,
      customerNumber: orderDetails.contact,
      memo: orderDetails.message
    };

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, orderData);
      alert('주문이 정상 접수 되었습니다! 배달 현황 페이지에서 확인할 수 있습니다.');
      setCart([]);
      setOrderDetails({ name: '', contact: '', message: '', location: '' });
      setShowModal(false);
    } catch (error) {
      console.error('Error placing order', error);
      alert('Failed to place order');
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.menuPrice * item.quantity), 0);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', contact: '', location: '' };

    if (orderDetails.name.length < 2) {
      newErrors.name = '이름은 2글자 이상이어야합니다';
      isValid = false;
    }
    if (orderDetails.name.length > 4) {
      newErrors.name = '이름은 4글자 이하이어야합니다';
      isValid = false;
    }

    const trimmedLocation = orderDetails.location.trim();
    if (trimmedLocation.length < 1) {
      newErrors.location = '최소 1글자 이상이어야됩니다';
      isValid = false;
    }
    if (trimmedLocation.length > 50) {
      newErrors.location = '최대 50글자까지 적을 수 있습니다';
      isValid = false;
    }

    const cleanedContact = orderDetails.contact.replace(/\D/g, '');
    if (cleanedContact.length !== 11) {
      newErrors.contact = '-를 빼고 핸드폰번호 11글자 넣어야됩니다';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleOrderClick = () => {
    if (validateForm()) handleOrder();
  };

  return (
    <Container>
      <h1 className="mt-4">
        <FontAwesomeIcon icon={faUtensils} className="me-2" />
        배달 주문
      </h1>

      {menuItems.length === 0 ? (
        <p className="text-center mt-5">등록된 메뉴가 없습니다.</p>
      ) : (
        <Row>
          {menuItems.map(item => (
            <Col key={item._id} sm={12} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Img variant="top" src={`${process.env.REACT_APP_API_URL}${item.menuPicturePath}`} alt={item.menuName} />
                <Card.Body>
                  <Card.Title>{item.menuName}</Card.Title>
                  <Card.Text>{item.menuDescription}</Card.Text>
                  <Card.Text><strong>{item.menuPrice}￦</strong></Card.Text>
                  <Card.Text>
                    {item.isValid ? (
                      <span style={{ color: 'green' }}>판매중</span>
                    ) : (
                      <span style={{ color: 'red' }}>품절</span>
                    )}
                  </Card.Text>
                  {item.isValid ? (
                    <QuantitySelector item={item} onAddToCart={handleAddToCart} />
                  ) : (
                    <Button variant="secondary" disabled>품절</Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <div className="cart-icon" onClick={() => setShowModal(true)} style={{ position: 'fixed', bottom: 30, right: 30, cursor: 'pointer' }}>
        <FontAwesomeIcon icon={faShoppingCart} size="4x" />
        {cart.length > 0 && <Badge bg="danger">{cart.length}</Badge>}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>주문자 이름</Form.Label>
              <Form.Control
                type="text"
                value={orderDetails.name}
                onChange={(e) => setOrderDetails({ ...orderDetails, name: e.target.value.slice(0, 4) })}
              />
              {errors.name && <div className="text-danger">{errors.name}</div>}
            </Form.Group>
            <Form.Group controlId="formContact" className="mt-3">
              <Form.Label>주문자 핸드폰 번호('-' 제외 11자리)</Form.Label>
              <Form.Control
                placeholder='01012345678'
                type="text"
                value={orderDetails.contact}
                onChange={(e) => setOrderDetails({ ...orderDetails, contact: e.target.value })}
              />
              {errors.contact && <div className="text-danger">{errors.contact}</div>}
            </Form.Group>
            <Form.Group controlId="formMessage" className="mt-3">
              <Form.Label>요청사항</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={orderDetails.message}
                onChange={(e) => setOrderDetails({ ...orderDetails, message: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formLocation" className="mt-3">
              <Form.Label>배달받을 장소(명확히 입력)</Form.Label>
              <Form.Control
                type="text"
                value={orderDetails.location}
                onChange={(e) => setOrderDetails({ ...orderDetails, location: e.target.value })}
              />
              {errors.location && <div className="text-danger">{errors.location}</div>}
            </Form.Group>
          </Form>

          <h3 className="mt-4">Cart</h3>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.menuName} - {item.quantity}개 x {item.menuPrice}원 = {item.quantity * item.menuPrice}원
                <Button variant="danger" size="sm" className="ms-2" onClick={() => handleRemoveFromCart(index)}>삭제</Button>
              </li>
            ))}
          </ul>
          <h4>Total: {getTotalPrice()}원</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>닫기</Button>
          <Button variant="primary" onClick={handleOrderClick}>주문하기</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

function QuantitySelector({ item, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const increment = () => setQuantity(quantity + 1);
  const decrement = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  return (
    <>
      <div className="quantity-selector mb-2">
        <Button variant="secondary" size="sm" onClick={decrement}>-</Button>
        <span className="mx-2">{quantity}</span>
        <Button variant="secondary" size="sm" onClick={increment}>+</Button>
      </div>
      <Button variant="primary" onClick={() => onAddToCart(item, quantity)}>Add to Cart</Button>
    </>
  );
}

export default MenuOrder;
