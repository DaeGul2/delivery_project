// src/pages/Home.js
import React from 'react';
import { Container, Row, Col, Carousel, Button  } from 'react-bootstrap';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {

  const navigate = useNavigate();

  return (
    <Container className="home-container">
      <Row className="mt-4">
        <Col md={12}>
          <video className="home-video" autoPlay muted loop>
            <source src="/videos/promo2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={12} className="text-center">
          <Button className="order-button" onClick={() => navigate('/menu-order')}>
            주문 GOGO
          </Button>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={12}>
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100 carousel-image"
                src="/images/image1.jpg"
                alt="First slide"
              />
              <Carousel.Caption>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100 carousel-image"
                src="/images/image2.jpg"
                alt="Second slide"
              />
              <Carousel.Caption>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100 carousel-image"
                src="/images/image3.jpg"
                alt="Third slide"
              />
              <Carousel.Caption>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100 carousel-image"
                src="/images/image4.jpg"
                alt="Fourth slide"
              />
              <Carousel.Caption>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100 carousel-image"
                src="/images/image5.jpg"
                alt="Fifth slide"
              />
              <Carousel.Caption>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100 carousel-image"
                src="/images/image6.jpg"
                alt="Sixth slide"
              />
              <Carousel.Caption>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
