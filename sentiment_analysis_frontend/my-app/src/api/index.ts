import axios from "axios";
import { IMultiPredictResponse } from "../types/index.ts";

const API_URL = "http://127.0.0.1:8000/api/";

const predictSentiment = async (text: string, model: string) => {
  const endpoint = "predict/";
  const payload = { 
    text: text,
    model_name: model
  };
  return await axios.post(API_URL + endpoint, payload);
}

const multiPredictSentiment = async (texts: string[]): Promise<IMultiPredictResponse> => {
  const endpoint = "multiPredict/";
  const payload = { texts };
  return await axios.post(API_URL + endpoint, payload);
}

const getModels = async () => {
    const endpoint = "getModels/";
    return await axios.get(API_URL + endpoint);
}

const sentimentApi = {
  predictSentiment,
  multiPredictSentiment,
  getModels
}

export default sentimentApi