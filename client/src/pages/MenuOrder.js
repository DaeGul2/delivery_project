import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUtensils } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function MenuOrder() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // 이미지 모달
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
      alert('장바구니가 비어 있습니다.');
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
      alert('주문이 접수되었습니다.');
      setCart([]);
      setOrderDetails({ name: '', contact: '', message: '', location: '' });
      setShowModal(false);
    } catch (error) {
      console.error('Error placing order', error);
      alert('주문 실패');
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.menuPrice * item.quantity), 0);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', contact: '', location: '' };

    if (orderDetails.name.length < 2) {
      newErrors.name = '이름은 2글자 이상이어야 합니다';
      isValid = false;
    }
    if (orderDetails.name.length > 4) {
      newErrors.name = '이름은 4글자 이하이어야 합니다';
      isValid = false;
    }

    const cleanedContact = orderDetails.contact.replace(/\D/g, '');
    if (cleanedContact.length !== 11) {
      newErrors.contact = '핸드폰 번호는 11자리여야 합니다';
      isValid = false;
    }

    if (orderDetails.location.trim().length === 0) {
      newErrors.location = '장소를 입력해주세요';
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
      <h1 className="mt-4"><FontAwesomeIcon icon={faUtensils} className="me-2" />배달 주문</h1>

      {menuItems.length === 0 ? (
        <p className="text-center mt-5">등록된 메뉴가 없습니다.</p>
      ) : (
        <Row>
          {menuItems.map(item => (
            <Col key={item._id} xs={6} sm={6} md={4} className="mb-4">
              <Card className="h-100">
                <div onClick={() => setPreviewImage(`${process.env.REACT_APP_API_URL}${item.menuPicturePath}`)} style={{ cursor: 'pointer' }}>
                  <Card.Img
                    variant="top"
                    src={`${process.env.REACT_APP_API_URL}${item.menuPicturePath}`}
                    alt={item.menuName}
                    style={{ height: '140px', objectFit: 'cover' }}
                  />
                </div>
                <Card.Body>
                  <Card.Title>{item.menuName}</Card.Title>
                  <Card.Text>{item.menuDescription}</Card.Text>
                  <Card.Text><strong>{item.menuPrice}원</strong></Card.Text>
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
        <FontAwesomeIcon icon={faShoppingCart} size="3x" />
        {cart.length > 0 && <Badge bg="danger">{cart.length}</Badge>}
      </div>

      {/* 주문 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>주문 내역</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>이름</Form.Label>
              <Form.Control type="text" value={orderDetails.name} onChange={(e) => setOrderDetails({ ...orderDetails, name: e.target.value.slice(0, 4) })} />
              {errors.name && <div className="text-danger">{errors.name}</div>}
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>전화번호 (예: 01012345678)</Form.Label>
              <Form.Control type="text" value={orderDetails.contact} onChange={(e) => setOrderDetails({ ...orderDetails, contact: e.target.value })} />
              {errors.contact && <div className="text-danger">{errors.contact}</div>}
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>배달 위치</Form.Label>
              <Form.Control type="text" value={orderDetails.location} onChange={(e) => setOrderDetails({ ...orderDetails, location: e.target.value })} />
              {errors.location && <div className="text-danger">{errors.location}</div>}
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>요청사항</Form.Label>
              <Form.Control as="textarea" rows={2} value={orderDetails.message} onChange={(e) => setOrderDetails({ ...orderDetails, message: e.target.value })} />
            </Form.Group>
          </Form>
          <hr />
          <h5>🛒 장바구니</h5>
          <ul>
            {cart.map((item, i) => (
              <li key={i}>
                {item.menuName} - {item.quantity}개 × {item.menuPrice}원 = {item.quantity * item.menuPrice}원
                <Button variant="danger" size="sm" className="ms-2" onClick={() => handleRemoveFromCart(i)}>삭제</Button>
              </li>
            ))}
          </ul>
          <h6 className="mt-2">총합계: {getTotalPrice()}원</h6>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>닫기</Button>
          <Button variant="primary" onClick={handleOrderClick}>주문하기</Button>
        </Modal.Footer>
      </Modal>

      {/* 이미지 미리보기 모달 */}
      <Modal show={!!previewImage} onHide={() => setPreviewImage(null)} centered fullscreen>
        <Modal.Body
          className="p-0 position-relative bg-dark d-flex justify-content-center align-items-center"
          style={{ height: '100vh', width: '100vw' }} // 전체 뷰포트
        >
          {/* 닫기 버튼 */}
          <Button
            variant="light"
            onClick={() => setPreviewImage(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              zIndex: 1051
            }}
          >
            ✕
          </Button>

          {/* 이미지 꽉 차게 비율 유지 */}
          <img
            src={previewImage}
            alt="Preview"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'  // 크기에 맞게, 비율 유지하며 꽉 채움
            }}
          />
        </Modal.Body>
      </Modal>


    </Container>
  );
}

function QuantitySelector({ item, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  return (
    <>
      <div className="mb-2">
        <Button size="sm" variant="secondary" onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)}>-</Button>
        <span className="mx-2">{quantity}</span>
        <Button size="sm" variant="secondary" onClick={() => setQuantity(q => q + 1)}>+</Button>
      </div>
      <Button variant="primary" size="sm" onClick={() => onAddToCart(item, quantity)}>Add to Cart</Button>
    </>
  );
}

export default MenuOrder;
