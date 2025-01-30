from sklearn.metrics import precision_recall_fscore_support, accuracy_score
from transformers import BertTokenizer, BertForSequenceClassification
from torch.nn.functional import softmax
import torch
import os
import numpy as np
import pandas as pd

TOKEN_LIMIT = 400

MODEL_1_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'sentiment_analysis_backend', 'Models', 'Model_1')
MODEL_2_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'sentiment_analysis_backend', 'Models', 'Model_2')

models = {
    'Base Model': {
        'model': BertForSequenceClassification.from_pretrained(MODEL_1_PATH),
        'tokenizer': BertTokenizer.from_pretrained(MODEL_1_PATH),
    },
    'HLA Model': {
        'model': BertForSequenceClassification.from_pretrained(MODEL_2_PATH),
        'tokenizer': BertTokenizer.from_pretrained(MODEL_2_PATH),
    }
}

for model_info in models.values():
    model_info['model'].eval()

def predict(text: str, model_name: str):
    if model_name not in models:
        raise ValueError(f"Invalid model name: {model_name}. Available models: {list(models.keys())}")

    model_info = models[model_name]
    tokenizer = model_info['tokenizer']
    model = model_info['model']

    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=TOKEN_LIMIT)

    with torch.no_grad():
        outputs = model(**inputs)
    logits = outputs.logits
    
    probabilities = softmax(logits, dim=-1)
    
    prediction = torch.argmax(probabilities, dim=-1).item()
    confidence = probabilities[0, prediction].item()
    
    return prediction, confidence

def compute_metrics(labels, preds):
    preds = np.array(preds).argmax(-1)
    labels = np.array(labels)
    precision, recall, f1, _ = precision_recall_fscore_support(labels, preds, average='weighted')
    acc = accuracy_score(labels, preds)
    return {
        'accuracy': acc,
        'f1': f1,
        'precision': precision,
        'recall': recall
    }

def predict_batch(text: str, model_name: str):
    if model_name not in models:
        raise ValueError(f"Invalid model name: {model_name}. Available models: {list(models.keys())}")

    model_info = models[model_name]
    tokenizer = model_info['tokenizer']
    model = model_info['model']

    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=TOKEN_LIMIT)

    with torch.no_grad():
        logits = model(**inputs).logits
    predictions = torch.softmax(logits, dim=-1).cpu().numpy()
    return predictions

def predict_and_evaluate():
    data = pd.read_csv('data.csv')
    texts = data["text"].tolist()
    labels = data["polarity"].tolist()

    preds = predict_batch(texts, 'Base Model')