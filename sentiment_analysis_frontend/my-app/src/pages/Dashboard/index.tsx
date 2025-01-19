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
} from "react-bootstrap";
import DataTable from "../../components/CustomTable.tsx";
import Customchart from "../../components/CustomChart.tsx";
import FileUploadButton from "../../components/FileUploadButton.tsx";
import sentimentApi from "../../api/index.ts";
import { Alert } from "react-bootstrap";

export const Dashboard = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("Select a Model");

  const handlePredict = async (text: string) => {
    try {
      const response = await sentimentApi.predictSentiment(text, selectedModel);
      alert(response.data.sentiment);
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await sentimentApi.getModels();
        setModels(response.data.models);
        console.log(response.data.models);
      } catch (error: any) {
        alert(error.message);
      }
    };
    fetchModels();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <Form>
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
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
        <Form.Group>
          <Form.Label>Search</Form.Label>
          <FormControl
            type="text"
            placeholder="Enter your text here..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={() => handlePredict(userInput)}>
          Predict
        </Button>
        <FileUploadButton />
      </Form>
      <DataTable />
      <Customchart />
    </div>
  );
};
