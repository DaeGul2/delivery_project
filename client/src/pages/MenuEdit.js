// src/pages/MenuEdit.js
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Modal, Card, ListGroup } from 'react-bootstrap';
import axios from 'axios';

function MenuEdit() {
  const [menuName, setMenuName] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [menuDescription, setMenuDescription] = useState('');
  const [menuPicture, setMenuPicture] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentMenu, setCurrentMenu] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Fetch existing menu items from the server
    axios.get(`${process.env.REACT_APP_API_URL}/api/menus`)
      .then(response => {
        setMenuItems(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the menu data!', error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('menuName', menuName);
    formData.append('menuPrice', menuPrice);
    formData.append('menuDescription', menuDescription);
    formData.append('menuPicture', menuPicture);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/menus`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Menu item added successfully');
      // Reset form
      setMenuName('');
      setMenuPrice('');
      setMenuDescription('');
      setMenuPicture(null);
      // Refresh menu items
      setMenuItems([...menuItems, response.data]);
    } catch (error) {
      console.error('Error adding menu item', error);
      alert('Failed to add menu item');
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('menuName', currentMenu.menuName);
    formData.append('menuPrice', currentMenu.menuPrice);
    formData.append('menuDescription', currentMenu.menuDescription);
    formData.append('isValid', currentMenu.isValid);
    if (menuPicture) {
      formData.append('menuPicture', menuPicture);
    }

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/menus/${currentMenu._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Menu item updated successfully');
      setShowModal(false);
      // Refresh menu items
      const updatedMenuItems = menuItems.map(item => item._id === currentMenu._id ? { ...currentMenu, menuPicturePath: item.menuPicturePath } : item);
      setMenuItems(updatedMenuItems);
      setMenuPicture(null);
    } catch (error) {
      console.error('Error updating menu item', error);
      alert('Failed to update menu item');
    }
  };

  const handleEditClick = (menu) => {
    setCurrentMenu(menu);
    setShowModal(true);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setCurrentMenu(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSelectChange = (e) => {
    const { value } = e.target;
    setCurrentMenu(prevState => ({
      ...prevState,
      isValid: value === 'true'
    }));
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h2>Create Menu</h2>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formMenuName">
                  <Form.Label>Menu Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={menuName}
                    onChange={(e) => setMenuName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formMenuPrice" className="mt-3">
                  <Form.Label>Menu Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={menuPrice}
                    onChange={(e) => setMenuPrice(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formMenuDescription" className="mt-3">
                  <Form.Label>Menu Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={menuDescription}
                    onChange={(e) => setMenuDescription(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formMenuPicture" className="mt-3">
                  <Form.Label>Menu Picture</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => setMenuPicture(e.target.files[0])}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  Add Menu
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h2>Update Menu</h2>
            </Card.Header>
            <Card.Body>
              <ListGroup>
                {menuItems.map(item => (
                  <ListGroup.Item key={item._id} action onClick={() => handleEditClick(item)}>
                    {item.menuName} - ${item.menuPrice}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateSubmit}>
            <Form.Group controlId="formMenuName">
              <Form.Label>Menu Name</Form.Label>
              <Form.Control
                type="text"
                name="menuName"
                value={currentMenu.menuName}
                onChange={handleModalChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formMenuPrice" className="mt-3">
              <Form.Label>Menu Price</Form.Label>
              <Form.Control
                type="number"
                name="menuPrice"
                value={currentMenu.menuPrice}
                onChange={handleModalChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formMenuDescription" className="mt-3">
              <Form.Label>Menu Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="menuDescription"
                value={currentMenu.menuDescription}
                onChange={handleModalChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formMenuPicture" className="mt-3">
              <Form.Label>Menu Picture</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setMenuPicture(e.target.files[0])}
              />
            </Form.Group>
            <Form.Group controlId="formIsValid" className="mt-3">
              <Form.Label>품절 선택</Form.Label>
              <Form.Control
                as="select"
                name="isValid"
                value={currentMenu.isValid}
                onChange={handleSelectChange}
                required
              >
                <option value="true">판매중</option>
                <option value="false">품절</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Update Menu
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default MenuEdit;
