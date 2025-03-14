import React, { useRef } from "react";
import { Button } from "react-bootstrap";
import sentimentApi from "../api/index.ts";
import { useDispatch } from "react-redux";
import { uploadCSVRequest, uploadCSVSuccess, uploadCSVFailure, addToast } from "../actions/index.ts";
import { PREDICTED_STATES } from "../pages/constants.ts";

interface FileUploadButtonProps {
  selectedModel: string;
  setPredictedState: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadCSVButton: React.FC<FileUploadButtonProps> = ({
  selectedModel,
  setPredictedState,
}) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      await handleUpload(file);
      event.target.value = "";
    }
  };

  const handleUpload = async (file: File) => {
    if (!file) {
      dispatch(addToast("No file selected."));
      return;
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("model_name", selectedModel)

    try {
      dispatch(uploadCSVRequest())
      const response = await sentimentApi.uploadCSV(formData)
      dispatch(uploadCSVSuccess(response.data))
      setPredictedState(PREDICTED_STATES.multi)
    } catch (error: any) {
      dispatch(uploadCSVFailure(error.message))
      dispatch(addToast(error.message))
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <Button variant="primary" onClick={() => handleButtonClick()}>
        Upload
      </Button>
    </div>
  );
};

export default UploadCSVButton;
