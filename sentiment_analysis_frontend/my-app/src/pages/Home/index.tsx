import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Navbar,
  Nav,
  Dropdown,
} from "react-bootstrap";
import "../../assets/Home/index.css";

export const Home = () => {
  return (
    <div>
      <Container className="home-container">
        <h1>Welcome, click the button to begin!</h1>
        <Button variant="primary" href="/dashboard">
          Go to Dashboard
        </Button>
      </Container>
    </div>
  );
};
