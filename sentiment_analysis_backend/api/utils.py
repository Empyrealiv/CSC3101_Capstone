from transformers import BertTokenizer, BertForSequenceClassification
import torch
import os

MODEL_1_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'sentiment_analysis_backend', 'Models', 'Model_1')
model_1 = BertForSequenceClassification.from_pretrained(MODEL_1_PATH)
tokenizer_1 = BertTokenizer.from_pretrained(MODEL_1_PATH)
model_1.eval()

MODEL_2_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'sentiment_analysis_backend', 'Models', 'Model_2')
model_2 = BertForSequenceClassification.from_pretrained(MODEL_2_PATH)
tokenizer_2 = BertTokenizer.from_pretrained(MODEL_2_PATH)
model_2.eval()

def predict(text: str):
    inputs = tokenizer_1(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = model_1(**inputs)
    logits = outputs.logits
    prediction = torch.argmax(logits, dim=-1).item()
    return prediction