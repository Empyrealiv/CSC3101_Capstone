from sklearn.metrics import precision_recall_fscore_support, accuracy_score
from transformers import BertTokenizer, BertForSequenceClassification, BertModel
from torch.nn.functional import softmax
from transformers import Trainer, TrainingArguments, DataCollatorWithPadding
from .classes import WHLA_BERT
import torch
import torch.nn as nn
import os
import numpy as np
import pandas as pd
import json

TOKEN_LIMIT = 512

MLM_MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'sentiment_analysis_backend', 'Models', 'mlm_pretraining_6')
BASE_MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'sentiment_analysis_backend', 'Models', 'base_model')
WHLA_FINAL_MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'sentiment_analysis_backend', 'Models', 'whla_final_model')

def get_custom_model_files(model_dir):

    dir_name = os.path.basename(os.path.normpath(model_dir))
    model_filename = f"{dir_name}.pth"
    json_filename = f"{dir_name}_config.json"

    meta_data = {
        "model_filename": os.path.join(os.path.dirname(__file__), '..', '..', 'sentiment_analysis_backend', 'Models', dir_name, model_filename),
        "json_filename": os.path.join(os.path.dirname(__file__), '..', '..', 'sentiment_analysis_backend', 'Models', dir_name, json_filename)
    }

    return meta_data

def load_custom_model(model_path, num_labels=2):
    meta_data = get_custom_model_files(model_path)
    with open(meta_data['json_filename'], "r") as f:
        config = json.load(f)
    model = WHLA_BERT(pretrained_model=MLM_MODEL_PATH, num_labels=num_labels)
    model.gates = nn.Parameter(torch.tensor(config["gates"]))
    model.fc = nn.Linear(config["hidden_size"], config["num_labels"])
    model.load_state_dict(torch.load(
        meta_data['model_filename'], 
        map_location=torch.device('cpu'),
        weights_only=True
    ))

    return model

models = {
    'Base Model': {
        'model': BertForSequenceClassification.from_pretrained(BASE_MODEL_PATH),
        'tokenizer': BertTokenizer.from_pretrained(BASE_MODEL_PATH),
    },
    'WHLA Final Model': {
        'model': load_custom_model(WHLA_FINAL_MODEL_PATH, num_labels=2),
        'tokenizer': BertTokenizer.from_pretrained(MLM_MODEL_PATH),
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

    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=TOKEN_LIMIT)

    if isinstance(model, WHLA_BERT) and 'token_type_ids' in inputs:
        inputs.pop('token_type_ids')

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

    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
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

def tokenize_datasets(dataset, tokenizer):

    def tokenize_function(data):
        return tokenizer(
            data["text"], 
            truncation=True,
            max_length=TOKEN_LIMIT
        )
    
    tokenized_dataset = dataset.map(tokenize_function, batched=True)
    
    return tokenized_dataset

def macro_compute_metrics(labels, preds):
    preds = np.array(preds).argmax(-1)
    labels = np.array(labels)
    precision, recall, f1, _ = precision_recall_fscore_support(labels, preds, average='macro')
    acc = accuracy_score(labels, preds)
    return {
        'accuracy': acc,
        'f1': f1,
        'precision': precision,
        'recall': recall
    }

def binary_compute_metrics(pred):
    labels = pred.label_ids
    preds = pred.predictions.argmax(-1)
    precision, recall, f1, _ = precision_recall_fscore_support(labels, preds, average='binary')
    acc = accuracy_score(labels, preds)
    return {
        'accuracy': acc,
        'f1': f1,
        'precision': precision,
        'recall': recall
    }

def evaluate(model_name: str, dataset):
    model_info = models[model_name]
    tokenizer = model_info['tokenizer']
    model = model_info['model']

    tokenized_dataset = tokenize_datasets(dataset, tokenizer)
    data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

    training_args = TrainingArguments(
        output_dir="./results",
        per_device_eval_batch_size=16,
        report_to="none"
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        data_collator=data_collator,
        compute_metrics=binary_compute_metrics,
    )

    prediction_output = trainer.predict(tokenized_dataset)
    predicted_classes = np.argmax(prediction_output.predictions, axis=1)

    print(prediction_output)
    print(f"Predicted classes: {predicted_classes}")