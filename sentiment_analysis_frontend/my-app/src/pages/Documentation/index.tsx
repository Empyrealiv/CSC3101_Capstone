import React, { use, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Navbar,
  Nav,
  Dropdown,
  Spinner,
} from "react-bootstrap";
import "../../assets/Documentation/index.css";

export const Documentation = () => {
  return (
    <div className="page-container">
      <Container>
      <h1>API Documentation</h1>
      <hr className="separator" />
      <h2 className="heading">Upload CSV Endpoint</h2>
      <p>
        <strong>POST</strong> <span className="endpoint">/upload_csv</span>
      </p>

      <h3 className="heading">Request Example:</h3>
      <pre className="code-block">
        <code>
          curl -X POST -F "file=@sample.csv" -F "model_name=Base Model"
          http://127.0.0.1:8000/upload_csv/
        </code>
      </pre>

      <h3 className="heading">Response Example:</h3>
      <pre className="code-block">
        <code>
          {`{
  "results": [
    {
      "text": "I love this product! It's amazing.",
      "sentiment": "Positive",
      "confidence": 0.9920519590377808
    }
  ]
}`}
        </code>
      </pre>
      </Container>
    </div>
  );
};
