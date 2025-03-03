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
import Table from "react-bootstrap/Table";
import "../../assets/ModelInfo/index.css";

const FINE_TUNING_TABLE_HEADERS = [
  "Model",
  "Training Loss",
  "Validation Loss",
  "Accuracy",
  "F1 Score",
  "Precision",
  "Recall",
];

const PRE_TRAINING_TABLE_HEADERS = [
    "Model",
    "Training Loss",
    "Validation Loss"
];

const TEST_DATA = [
  {
    model_name: "Model 1",
    training_loss: 0.1,
    validation_loss: 0.2,
    accuracy: 0.8,
    f1_score: 0.7,
    precision: 0.6,
    recall: 0.5,
  },
  {
    model_name: "Model 2",
    training_loss: 0.2,
    validation_loss: 0.3,
    accuracy: 0.7,
    f1_score: 0.6,
    precision: 0.5,
    recall: 0.4,
  },
  {
    model_name: "Model 3",
    training_loss: 0.3,
    validation_loss: 0.4,
    accuracy: 0.6,
    f1_score: 0.5,
    precision: 0.4,
    recall: 0.3,
  },
];

const TEST_DATA_2 = [
    {
      model_name: "Model 1",
      training_loss: 0.1,
      validation_loss: 0.2,
    },
    {
      model_name: "Model 2",
      training_loss: 0.2,
      validation_loss: 0.3,
    },
  ];

export const ModelInfo = () => {
  return (
    <div className="page-container">
      <Container>
        {/* Fine tuning model information ( BINARY ) */}
        <Row>
          <Col>
            <h1>Model Info - Binary Fine Tuning</h1>
          </Col>
          <Table bordered hover>
            <thead>
              <tr>
                <th scope="col">#</th>
                {FINE_TUNING_TABLE_HEADERS.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEST_DATA.length > 0 ? (
                TEST_DATA.map((row, index) => (
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>{row.model_name}</td>
                    <td>{row.training_loss}</td>
                    <td>{row.validation_loss}</td>
                    <td>{row.accuracy}</td>
                    <td>{row.f1_score}</td>
                    <td>{row.precision}</td>
                    <td>{row.recall}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">
                    No records
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Row>

        {/* Pre training model information */}
        <Row>
          <Col>
            <h1>Model Info - MLM Pre-training</h1>
          </Col>
          <Table bordered hover>
            <thead>
              <tr>
                <th scope="col">#</th>
                {PRE_TRAINING_TABLE_HEADERS.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEST_DATA_2.length > 0 ? (
                TEST_DATA_2.map((row, index) => (
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>{row.model_name}</td>
                    <td>{row.training_loss}</td>
                    <td>{row.validation_loss}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">
                    No records
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Row>
      </Container>
    </div>
  );
};
