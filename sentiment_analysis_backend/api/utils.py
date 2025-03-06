from sklearn.metrics import precision_recall_fscore_support, accuracy_score
from transformers import BertTokenizer, BertForSequenceClassification
from torch.nn.functional import softmax
import torch
import os
import numpy as np
import pandas as pd

TOKEN_LIMIT = 512

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

def predict_with_gradient(text: str, model_name: str):
    if model_name not in models:
        raise ValueError(f"Invalid model name: {model_name}. Available models: {list(models.keys())}")

    model_info = models[model_name]
    tokenizer = model_info['tokenizer']
    model = model_info['model']

    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    input_ids = inputs["input_ids"]
    attention_mask = inputs["attention_mask"]

    embeddings = model.get_input_embeddings()(input_ids).detach()
    embeddings.requires_grad = True

    outputs = model(inputs_embeds=embeddings, attention_mask=attention_mask)
    logits = outputs.logits
    predicted_class = torch.argmax(logits, dim=1).item()
    confidence = torch.softmax(logits, dim=1)[0, predicted_class].item()

    logits[0, predicted_class].backward()
    gradients = embeddings.grad[0]  # Gradients with respect to embeddings

    # Compute token importance scores as the norm of gradient * embedding
    importance_scores = torch.norm(gradients * embeddings[0], dim=-1)

    # Normalize scores for interpretability
    importance_scores = importance_scores / importance_scores.sum()

    # Map tokens to words
    tokens = tokenizer.convert_ids_to_tokens(input_ids[0])

    # Filter tokens by threshold
    word_importance = [
        {"word": token, "contribution": score.item()}
        for token, score in zip(tokens, importance_scores)
        if token not in ["[CLS]", "[SEP]"]
    ]
    
    return predicted_class, confidence, word_importance

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