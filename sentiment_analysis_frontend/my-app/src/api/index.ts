import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

const predictSentiment = async (text: string, model: string) => {
  const endpoint = "predict/";
  const payload = {
    text: text,
    model_name: model,
  };
  return await axios.post(API_URL + endpoint, payload);
};

const predictWordImportance = async (text: string, model: string) => {
  const endpoint = "predictImportance/";
  const payload = {
    text: text,
    model_name: model,
  };
  return await axios.post(API_URL + endpoint, payload);
};

const getModels = async () => {
  const endpoint = "getModels/";
  return await axios.get(API_URL + endpoint);
};

const uploadCSV = async (formData: FormData) => {
  const endpoint = "uploadCSV/";
  return await axios.post(API_URL + endpoint, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const sentimentApi = {
  predictSentiment,
  predictWordImportance,
  getModels,
  uploadCSV,
};

export default sentimentApi;
