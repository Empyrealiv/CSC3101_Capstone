from transformers import BertTokenizer, BertForSequenceClassification
from torch.nn.functional import softmax
import torch
import os

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