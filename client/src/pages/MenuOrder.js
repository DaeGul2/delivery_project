import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function MenuOrder() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState({ name: '', contact: '', message: '', location: '' });
  const [errors, setErrors] = useState({ name: '', contact: '', location: '' });

  useEffect(() => {
    // Fetch menu items from the server
    axios.get(`${process.env.REACT_APP_API_URL}/api/menus`)
      .then(response => {
        setMenuItems(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the menu data!', error);
      });
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
    // 주문 데이터 준비
    const orderData = {
      customerName: orderDetails.name,
      orderList: cart.map(item => ({
        menuId: item._id,
        count: item.quantity,
        price: item.menuPrice // 각 항목에 price 필드를 추가
      })),
      destination: orderDetails.location,
      customerNumber: orderDetails.contact,
      memo: orderDetails.message
    };

    // 서버로 주문 데이터 전송
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, orderData);
      alert('Order placed successfully!');
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

    // 이름 검증
    if (orderDetails.name.length < 2) {
      newErrors.name = '이름은 2글자 이상이어야합니다';
      isValid = false;
    }
    if (orderDetails.name.length > 4) {
      newErrors.name = '이름은 4글자 이하이어야합니다';
      isValid = false;
    }

    // 위치 검증
    const trimmedLocation = orderDetails.location.trim();
    if (trimmedLocation.length < 1) {
      newErrors.location = '최소 1글자 이상이어야됩니다';
      isValid = false;
    }
    if (trimmedLocation.length > 50) {
      newErrors.location = '최대 50글자까지 적을 수 있습니다';
      isValid = false;
    }

    // 연락처 검증
    const cleanedContact = orderDetails.contact.replace(/\D/g, ''); // 숫자만 남기기
    if (cleanedContact.length !== 11) {
      newErrors.contact = '-를 빼고 핸드폰번호 11글자 넣어야됩니다';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleOrderClick = () => {
    if (validateForm()) {
      handleOrder();
    }
  };

  return (
    <Container>
      
      <h1 className="mt-4"><FontAwesomeIcon icon={faUtensils} className="me-2" />배달 주문</h1>
      <Row>
        {menuItems.map(item => (
          <Col key={item._id} sm={12} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Img variant="top" src={`${process.env.REACT_APP_API_URL}${item.menuPicturePath}`} alt={item.menuName} />
              <Card.Body>
                <Card.Title>{item.menuName}</Card.Title>
                <Card.Text>{item.menuDescription}</Card.Text>
                <Card.Text><strong>${item.menuPrice}</strong></Card.Text>
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
      <div className="cart-icon" onClick={() => setShowModal(true)}>
        <FontAwesomeIcon icon={faShoppingCart} size="2x" />
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
                onChange={(e) => {
                  const value = e.target.value.slice(0, 4);
                  setOrderDetails({ ...orderDetails, name: value });
                }}
              />
              {errors.name && <div className="text-danger">{errors.name}</div>}
            </Form.Group>
            <Form.Group controlId="formContact" className="mt-3">
              <Form.Label>주문자 번호</Form.Label>
              <Form.Control
                type="text"
                value={orderDetails.contact}
                onChange={(e) => setOrderDetails({ ...orderDetails, contact: e.target.value })}
              />
              {errors.contact && <div className="text-danger">{errors.contact}</div>}
            </Form.Group>
            <Form.Group controlId="formMessage" className="mt-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={orderDetails.message}
                onChange={(e) => setOrderDetails({ ...orderDetails, message: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formLocation" className="mt-3">
              <Form.Label>배달받을 장소</Form.Label>
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
                <Button variant="danger" size="sm" onClick={() => handleRemoveFromCart(index)}>Remove</Button>
              </li>
            ))}
          </ul>
          <h4>Total: {getTotalPrice()}원</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleOrderClick}>Place Order</Button>
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
      <div className="quantity-selector">
        <Button variant="secondary" size="sm" onClick={decrement}>-</Button>
        <span>{quantity}</span>
        <Button variant="secondary" size="sm" onClick={increment}>+</Button>
      </div>
      <Button variant="primary" onClick={() => onAddToCart(item, quantity)}>Add to Cart</Button>
    </>
  );
}

export default MenuOrder;
