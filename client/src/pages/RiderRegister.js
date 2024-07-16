// src/pages/RiderRegister.js
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Modal, Card, ListGroup } from 'react-bootstrap';
import axios from 'axios';

function RiderRegister() {
  const [riderName, setRiderName] = useState('');
  const [riderNumber, setRiderNumber] = useState('');
  const [riders, setRiders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentRider, setCurrentRider] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Fetch existing riders from the server
    axios.get(`${process.env.REACT_APP_API_URL}/api/riders`)
      .then(response => {
        setRiders(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the rider data!', error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newRider = { riderName, riderNumber };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/riders`, newRider);
      alert('Rider added successfully');
      // Reset form
      setRiderName('');
      setRiderNumber('');
      // Refresh riders list
      setRiders([...riders, response.data]);
    } catch (error) {
      console.error('Error adding rider', error);
      alert('Failed to add rider');
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/riders/${currentRider._id}`, currentRider);
      alert('Rider updated successfully');
      setShowModal(false);
      // Refresh riders list
      const updatedRiders = riders.map(item => item._id === currentRider._id ? currentRider : item);
      setRiders(updatedRiders);
    } catch (error) {
      console.error('Error updating rider', error);
      alert('Failed to update rider');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/riders/${id}`);
      alert('Rider deleted successfully');
      // Refresh riders list
      setRiders(riders.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting rider', error);
      alert('Failed to delete rider');
    }
  };

  const handleEditClick = (rider) => {
    setCurrentRider(rider);
    setShowModal(true);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setCurrentRider(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h2>Create Rider</h2>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formRiderName">
                  <Form.Label>Rider Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={riderName}
                    onChange={(e) => setRiderName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formRiderNumber" className="mt-3">
                  <Form.Label>Rider Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={riderNumber}
                    onChange={(e) => setRiderNumber(e.target.value)}
                    placeholder="핸드폰 번호 13자리 ('-' 제외)"
                    pattern="\d{3}\d{3,4}\d{4}"
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  Add Rider
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h2>Manage Riders</h2>
            </Card.Header>
            <Card.Body>
              <ListGroup>
                {riders.map(item => (
                  <ListGroup.Item key={item._id}>
                    <Row>
                      <Col xs={8}>
                        {item.riderName} - {item.riderNumber}
                      </Col>
                      <Col xs={4} className="text-end">
                        <Button variant="warning" size="sm" onClick={() => handleEditClick(item)}>Edit</Button>{' '}
                        <Button variant="danger" size="sm" onClick={() => handleDelete(item._id)}>Delete</Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Rider</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateSubmit}>
            <Form.Group controlId="formRiderName">
              <Form.Label>Rider Name</Form.Label>
              <Form.Control
                type="text"
                name="riderName"
                value={currentRider.riderName}
                onChange={handleModalChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formRiderNumber" className="mt-3">
              <Form.Label>Rider Number</Form.Label>
              <Form.Control
                type="text"
                name="riderNumber"
                value={currentRider.riderNumber}
                onChange={handleModalChange}
                placeholder="핸드폰 번호 13자리 ('-' 제외)"
                pattern="\d{3}\d{3,4}\d{4}"
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Update Rider
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default RiderRegister;
