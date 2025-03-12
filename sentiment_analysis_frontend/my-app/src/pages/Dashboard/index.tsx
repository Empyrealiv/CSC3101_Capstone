import React from "react";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import {
  Container,
  Row,
  Col,
  Button,
  Dropdown,
  Spinner,
} from "react-bootstrap";
import CustomDataTable from "../../components/CustomDataTable.tsx";
import Customchart from "../../components/CustomChart.tsx";
import CustomEvalDataTable from "../../components/CustomEvalDataTable.tsx";
import FileUploadButton from "../../components/FileUploadButton.tsx";
import sentimentApi from "../../api/index.ts";
import "../../assets/Dashboard/index.css";
import { PREDICTED_STATES } from "../constants.ts";
import { useDispatch, useSelector } from "react-redux";
import { selectuploadCSVState } from "../../selectors/index.ts";
import { ToastManager } from "../../components/ToastManager.tsx";
import { IPredictResponse, IPredictResults } from "../../types/index.ts";
import { addToast } from "../../actions/index.ts";
import { processText, formatContribution } from "../functions.ts";

export const Dashboard = () => {
  const [predictedState, setPredictedState] = useState<string>("");
  const [predictResult, setPredictResult] = useState<IPredictResults | null>();
  const [userInput, setUserInput] = useState<string>("");
  const [textInfo, setTextInfo] = useState<string>("");
  const [hoveredToken, setHoveredToken] = useState<number | null>(null);
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("Select a Model");
  const [loading, setLoading] = useState<boolean>(false);
  const uploadCSVData = useSelector(selectuploadCSVState);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const response = await sentimentApi.getModels();
        setModels(response.data.models);
        setSelectedModel(response.data.models[0]);
      } catch (error: any) {
        dispatch(addToast(error.message));
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, []);

  const validations = () => {
    if (userInput === "") {
      dispatch(addToast("Please enter some text"));
      return false;
    }
    return true;
  };

  const handlePredict = async (text: string) => {
    if (!validations()) {
      return;
    }
    try {
      setLoading(true);
      const response = await sentimentApi.predictWordImportance(
        text,
        selectedModel
      );
      handlePredictResponse(response.data);
      setPredictedState(PREDICTED_STATES.single);
    } catch (error: any) {
      dispatch(addToast(error.message));
    } finally {
      setLoading(false);
    }
  };

  const handlePredictResponse = (data: IPredictResponse) => {
    const processedTokens = processText(userInput, data.word_importance);
    const predictResults: IPredictResults = {
      sentiment: data.sentiment,
      confidence: data.confidence,
      words: processedTokens,
    };
    setPredictResult(predictResults);
  };

  return (
    <div className="page-container">
      <ToastManager />

      {/* Loading Overlay */}
      {(loading || uploadCSVData.isLoading) && (
        <div className="loading-overlay">
          <Spinner animation="border" variant="light" />
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
      {predictedState === "" && (
        <Container className="display-container">
          <p>Make a prediction!</p>
        </Container>
      )}

      {/* Single Predict Container */}
      {predictedState === PREDICTED_STATES.single && (
        <Container className="display-container">
          <p>
            The text was predicted with a sentiment of{" "}
            <span
              style={{
                color:
                  predictResult?.sentiment === "POSITIVE"
                    ? "green"
                    : predictResult?.sentiment === "NEGATIVE"
                    ? "red"
                    : "inherit",
              }}
            >
              {predictResult?.sentiment}
            </span>
          </p>
          <p>Confidence: {predictResult?.confidence}</p>
          <div className="text-container">
            <p>
              {predictResult?.words.map((token, index) => {
                const style: React.CSSProperties = token.isHighlighted
                  ? {
                      backgroundColor: "rgba(255, 0, 0, 0.5)",
                      padding: "2px 4px",
                      borderRadius: "4px",
                      margin: "0 2px",
                      position: "relative",
                      cursor: "pointer",
                      lineHeight: "1.75",
                    }
                  : {};

                const hoverProps =
                  token.isHighlighted && token.contribution !== undefined
                    ? {
                        onMouseEnter: () => setHoveredToken(index),
                        onMouseLeave: () => setHoveredToken(null),
                        className: "important-word",
                      }
                    : {};

                return (
                  <span key={index} style={style} {...hoverProps}>
                    {token.text}
                    {hoveredToken === index &&
                      token.contribution !== undefined && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: "100%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            backgroundColor: "#333",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "14px",
                            whiteSpace: "nowrap",
                            zIndex: 1000,
                            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                          }}
                        >
                          Importance: {formatContribution(token.contribution)}
                        </span>
                      )}
                  </span>
                );
              })}
            </p>
          </div>
        </Container>
      )}

      {/* Multi Predict Container */}
      {predictedState === PREDICTED_STATES.multi && (
        <Container className="display-container">
          <Container>
            <Row>
              <Col xs={4} className="custom-chart-container">
                <Customchart />
              </Col>
              <Col>
                <Container>
                  <Row className="custom-table-container">
                    <CustomDataTable setTextInfo={setTextInfo} />
                  </Row>
                  <br />
                  <Row>
                    <CustomEvalDataTable />
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>
        </Container>
      )}

      {/* User Input Container */}
      <Container className="input-container">
        <textarea
          className="input-text"
          placeholder="Enter your text here..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handlePredict(userInput);
            }
          }}
        />
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
      </Container>
    </div>
  );
};
