// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import './App.css';
import Home from './pages/Home';
import MenuOrder from './pages/MenuOrder';
import MenuEdit from './pages/MenuEdit';
import RiderRegister from './pages/RiderRegister';
import SalesManagement from './pages/SalesManagement';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="/">청심 배달</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/menu-order">주문하기</Nav.Link>
                <Nav.Link href="/menu-edit">메뉴설정</Nav.Link>
                <Nav.Link href="/rider-register">배달원 등록</Nav.Link>
                <Nav.Link href="/sales-management">매출 통계</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu-order" element={<MenuOrder />} />
            <Route path="/menu-edit" element={<MenuEdit />} />
            <Route path="/rider-register" element={<RiderRegister />} />
            <Route path="/sales-management" element={<SalesManagement />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
