import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  addToast,
  uploadCSVFailure,
  uploadCSVRequest,
  uploadCSVSuccess,
} from "../actions/index.ts";
import sentimentApi from "../api/index.ts";
import { PREDICTED_STATES } from "../pages/constants.ts";
import "../assets/Components/index.css";

interface UploadCSVModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  selectedModel: string;
  setPredictedState: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadCSVModal: React.FC<UploadCSVModalProps> = ({
  show,
  onHide,
  title,
  selectedModel,
  setPredictedState,
  setLoading,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState(false);
  const [evaluationMode, setEvaluationMode] = useState(false);
  const dispatch = useDispatch();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setFileError(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setFileError(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("model_name", selectedModel);
    formData.append("evaluation_mode", evaluationMode.toString());

    try {
      handleCancel();
      dispatch(uploadCSVRequest());
      const response = await sentimentApi.uploadCSV(formData);
      dispatch(uploadCSVSuccess(response.data));
      setPredictedState(PREDICTED_STATES.multi);
    } catch (error: any) {
      dispatch(uploadCSVFailure(error.response.data.error));
      dispatch(addToast(error.response.data.error));
    }
  };

  const resetModal = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSelectedFile(null);
    setFileError(false);
  };

  const handleCancel = () => {
    resetModal();
    onHide();
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEvaluationMode(e.target.checked);
  };

  return (
    <Modal show={show} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Control
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            isInvalid={fileError}
          />
          <Form.Control.Feedback type="invalid">
            Please select a CSV file.
          </Form.Control.Feedback>
        </Form.Group>
        <div className="toggle-switch-container">
        <Form.Label>Enable Evaluation Mode</Form.Label>
        <Form.Check 
              type="switch"
              id="evaluation-mode-switch"
              label=""
              className="custom-switch"
              checked={evaluationMode}
              onChange={handleSwitchChange}
            />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleUpload}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadCSVModal;
