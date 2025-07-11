// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Modal, Button, Form } from 'react-bootstrap';
import './App.css';
import Home from './pages/Home';
import MenuOrder from './pages/MenuOrder';
import MenuEdit from './pages/MenuEdit';
import RiderRegister from './pages/RiderRegister';
import SalesManagement from './pages/SalesManagement';
import ProtectedRoute from './components/ProtectedRoute';
import DeliveryStatus from './pages/DeliveryStatus';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth) {
      const { expires } = JSON.parse(adminAuth);
      if (new Date(expires) > new Date()) {
        setIsAdmin(true);
      } else {
        localStorage.removeItem('adminAuth');
      }
    }
  }, []);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (authCode === '1a2a3a') {
      const expires = new Date();
      expires.setHours(expires.getHours() + 1); // 인증 유효시간 1시간
      localStorage.setItem('adminAuth', JSON.stringify({ expires }));
      setIsAdmin(true);
      setShowModal(false);
    } else {
      alert('Invalid code');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAdmin(false);
  };

  const AdminLinks = () => {
    const navigate = useNavigate();
    return (
      <>
        <Button variant="link" onClick={() => navigate('/menu-edit')} className="nav-link">Menu Edit</Button>
        <Button variant="link" onClick={() => navigate('/rider-register')} className="nav-link">Rider Register</Button>
        <Button variant="link" onClick={() => navigate('/sales-management')} className="nav-link">Sales Management</Button>
        <Button variant="link" onClick={handleLogout} className="nav-link">Logout</Button>
      </>
    );
  };

  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="/">청심 포차 & Cafe</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">홈</Nav.Link>
                <Nav.Link href="/menu-order">배달 주문</Nav.Link>
                <Nav.Link href="/delivery-status">배달 현황</Nav.Link>
                {isAdmin && <AdminLinks />}
              </Nav>
              <Nav>
                {!isAdmin && (
                  <Button variant="outline-light" onClick={() => setShowModal(true)}>
                    관리자 인증
                  </Button>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu-order" element={<MenuOrder />} />
            <Route path="/delivery-status" element={<DeliveryStatus />} />
            <Route 
              path="/menu-edit" 
              element={
                <ProtectedRoute isAdmin={isAdmin}>
                  <MenuEdit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/rider-register" 
              element={
                <ProtectedRoute isAdmin={isAdmin}>
                  <RiderRegister />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sales-management" 
              element={
                <ProtectedRoute isAdmin={isAdmin}>
                  <SalesManagement />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Container>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>관리자 인증</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAuthSubmit}>
              <Form.Group controlId="formAuthCode">
                <Form.Label>인증 코드</Form.Label>
                <Form.Control
                  type="password"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-3">
                인증
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </Router>
  );
}

export default App;
