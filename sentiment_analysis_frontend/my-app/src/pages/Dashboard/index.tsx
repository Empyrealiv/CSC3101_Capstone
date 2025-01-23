import React, { use } from "react";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import {
  Container,
  Row,
  Col,
  Button,
  Navbar,
  Nav,
  Dropdown,
  Spinner
} from "react-bootstrap";
import DataTable from "../../components/CustomTable.tsx";
import Customchart from "../../components/CustomChart.tsx";
import FileUploadButton from "../../components/FileUploadButton.tsx";
import sentimentApi from "../../api/index.ts";
import "../../assets/Dashboard/index.css";
import { PREDICTED_STATES } from "./constants.ts";
import { useSelector, useDispatch } from "react-redux";
import { selectMultiPredictState } from "../../selectors/index.ts";
import { multiPredictRequest } from "../../actions/index.ts";
import { IMultiPredictResponseItem } from "../../types/index";

export const Dashboard = () => {
  const [predictedState, setPredictedState] = useState<string>(
    PREDICTED_STATES.single
  );
  const [userInput, setUserInput] = useState<string>("");
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("Select a Model");
  const [loading, setLoading] = useState<boolean>(false);
  const multiPredictData = useSelector(selectMultiPredictState);

  const handlePredict = async (text: string) => {
    try {
      setLoading(true);
      setPredictedState(PREDICTED_STATES.single);
      const response = await sentimentApi.predictSentiment(text, selectedModel);
      alert(response.data.sentiment);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const response = await sentimentApi.getModels();
        setModels(response.data.models);
        setSelectedModel(response.data.models[0]);
      } catch (error: any) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, []);

  return (
    <div className="page-container">

      {/* Loading Overlay */}
      {(loading || multiPredictData.isLoading) && (
        <div className="loading-overlay">
          <Spinner animation="border" variant="light" />
          <p>Loading...</p>
        </div>
      )}

      {/* Header Container */}
      <Container className="header-container">
        <h1>Dashboard</h1>
        <Form>
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              {selectedModel}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {models.map((model, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => setSelectedModel(model)}
                >
                  {model}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Form>
      </Container>

      {/* Single Predict Container */}
      {predictedState === PREDICTED_STATES.single && (
        <Container className="display-container">
          <p>The text was predicted with a sentiment of positive</p>
          <p>Confidence: 0.98</p>
          <div className="text-container">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
              Nulla quis sem at nib
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
              Nulla quis sem at nib
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
              Nulla quis sem at nib
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
              Nulla quis sem at nib
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
              Nulla quis sem at nib
            </p>
          </div>
        </Container>
      )}

      {/* Multi Predict Container */}
      {predictedState === PREDICTED_STATES.multi && (
        <Container className="display-container">
          <DataTable />
          <Customchart />
        </Container>
      )}

      {/* User Input Container */}
      <Container className="input-container">
        <Form className="input-form">
          <Form.Group>
            <FormControl
              type="text"
              placeholder="Enter your text here..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
          </Form.Group>
          <div className="input-buttons">
            <FileUploadButton
              selectedModel={selectedModel}
              setPredictedState={setPredictedState}
              setLoading={setLoading}
            />
            <Button variant="primary" onClick={() => handlePredict(userInput)}>
              Predict
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};
