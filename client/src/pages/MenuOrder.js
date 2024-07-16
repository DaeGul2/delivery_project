// src/pages/MenuOrder.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function MenuOrder() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState({ name: '', contact: '', message: '' });

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

  const handleOrder = () => {
    // Simulating an order submission
    alert('Order placed successfully!');
    setCart([]);
    setOrderDetails({ name: '', contact: '', message: '' });
    setShowModal(false);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.menuPrice * item.quantity), 0);
  };

  return (
    <Container>
      <h1 className="mt-4">Menu + Order Page</h1>
      <Row>
        {menuItems.map(item => (
          <Col key={item._id} sm={12} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Img variant="top" src={`http://localhost:8080${item.menuPicturePath}`} alt={item.menuName} />
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
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={orderDetails.name}
                onChange={(e) => setOrderDetails({ ...orderDetails, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formContact">
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="text"
                value={orderDetails.contact}
                onChange={(e) => setOrderDetails({ ...orderDetails, contact: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formMessage">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={orderDetails.message}
                onChange={(e) => setOrderDetails({ ...orderDetails, message: e.target.value })}
              />
            </Form.Group>
          </Form>
          <h3 className="mt-4">Cart</h3>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.menuName} - {item.quantity} x ${item.menuPrice} = ${item.quantity * item.menuPrice}
                <Button variant="danger" size="sm" onClick={() => handleRemoveFromCart(index)}>Remove</Button>
              </li>
            ))}
          </ul>
          <h4>Total: ${getTotalPrice()}</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleOrder}>Place Order</Button>
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
