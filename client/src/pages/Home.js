// src/pages/Home.js
import React from 'react';
import { Container, Row, Col, Carousel, Button } from 'react-bootstrap';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <Col md={12}>
      <img
        className="d-block w-100 carousel-image"
        src="/images/logo2.png"
        alt="First slide"
        onClick={() => navigate('/menu-order')}
      />
    </Col>
  );
}

export default Home;
