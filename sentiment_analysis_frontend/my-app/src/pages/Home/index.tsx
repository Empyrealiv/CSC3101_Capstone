import React from "react";
import {
  Container,
  Button,
} from "react-bootstrap";
import "../../assets/Home/index.css";

export const Home = () => {
  return (
    <div>
      <Container className="home-container">
        <h1>Welcome!</h1>
        <div className="home-buttons">
          <Button variant="primary" href="/dashboard">
            Dashboard
          </Button>
          <Button variant="primary" href="/documentation">
            Documentation
          </Button>
        </div>
      </Container>
    </div>
  );
};
