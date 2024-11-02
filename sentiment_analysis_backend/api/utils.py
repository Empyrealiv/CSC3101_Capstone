from transformers import BertTokenizer, BertForSequenceClassification
import torch
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'sentiment_analysis_backend', 'Models', 'sentiment_model_new')
model = BertForSequenceClassification.from_pretrained(MODEL_PATH)
tokenizer = BertTokenizer.from_pretrained(MODEL_PATH)
model.eval()

def predict(text: str):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
    logits = outputs.logits
    prediction = torch.argmax(logits, dim=-1).item()
    return prediction