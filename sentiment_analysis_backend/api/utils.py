from sklearn.metrics import precision_recall_fscore_support, accuracy_score
from transformers import BertTokenizer, BertForSequenceClassification
from torch.nn.functional import softmax
from transformers import Trainer, TrainingArguments, DataCollatorWithPadding
from .constants import (
    BINARY_EMOTIONS_MAP,
    TENARY_EMOTIONS_MAP,
    EMOTIONS_6_MAP,
    GOEMOTIONS_MAP,
)
from .classes import WHLA_BERT
import torch
import torch.nn as nn
import os
import numpy as np
import json
from datasets import Value

TOKEN_LIMIT = 512

MLM_MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "..",
    "sentiment_analysis_backend",
    "Models",
    "mlm_pretraining_6",
)
BASE_MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "..",
    "sentiment_analysis_backend",
    "Models",
    "base_model",
)
BINARY_PROPOSED_MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "..",
    "sentiment_analysis_backend",
    "Models",
    "binary_proposed_model",
)
TERNARY_PROPOSED_MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "..",
    "sentiment_analysis_backend",
    "Models",
    "ternary_proposed_model",
)
EMOTIONS_PROPOSED_MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "..",
    "sentiment_analysis_backend",
    "Models",
    "emotions_proposed_model",
)


def get_custom_model_files(model_dir):

    dir_name = os.path.basename(os.path.normpath(model_dir))
    model_filename = f"{dir_name}.pth"
    json_filename = f"{dir_name}_config.json"

    meta_data = {
        "model_filename": os.path.join(
            os.path.dirname(__file__),
            "..",
            "..",
            "sentiment_analysis_backend",
            "Models",
            dir_name,
            model_filename,
        ),
        "json_filename": os.path.join(
            os.path.dirname(__file__),
            "..",
            "..",
            "sentiment_analysis_backend",
            "Models",
            dir_name,
            json_filename,
        ),
    }

    return meta_data


def load_custom_model(model_path):
    meta_data = get_custom_model_files(model_path)
    with open(meta_data["json_filename"], "r") as f:
        config = json.load(f)
    model = WHLA_BERT(pretrained_model=MLM_MODEL_PATH)
    model.gates = nn.Parameter(torch.tensor(config["gates"]))
    model.fc = nn.Linear(config["hidden_size"], config["num_labels"])
    model.load_state_dict(
        torch.load(
            meta_data["model_filename"],
            map_location=torch.device("cpu"),
            weights_only=True,
        )
    )
    return model


models = {
    "Binary SA Base Model": {
        "model": BertForSequenceClassification.from_pretrained(BASE_MODEL_PATH),
        "tokenizer": BertTokenizer.from_pretrained(BASE_MODEL_PATH),
        "label_map": BINARY_EMOTIONS_MAP,
        "mode": "binary",
    },
    "Binary SA Proposed Model": {
        "model": load_custom_model(BINARY_PROPOSED_MODEL_PATH),
        "tokenizer": BertTokenizer.from_pretrained(MLM_MODEL_PATH),
        "label_map": BINARY_EMOTIONS_MAP,
        "mode": "binary",
    },
    "Ternary SA Proposed Model": {
        "model": load_custom_model(TERNARY_PROPOSED_MODEL_PATH),
        "tokenizer": BertTokenizer.from_pretrained(MLM_MODEL_PATH),
        "label_map": TENARY_EMOTIONS_MAP,
        "mode": "ternary",
    },
    "Emotions SA Proposed Model": {
        "model": load_custom_model(EMOTIONS_PROPOSED_MODEL_PATH),
        "tokenizer": BertTokenizer.from_pretrained(MLM_MODEL_PATH),
        "label_map": EMOTIONS_6_MAP,
        "mode": "emotions-6-class",
    },
}

for model_info in models.values():
    model_info["model"].eval()


def predict(text: str, model_name: str, with_label: bool):
    if model_name not in models:
        raise ValueError(
            f"Invalid model name: {model_name}. Available models: {list(models.keys())}"
        )

    model_info = models[model_name]
    tokenizer = model_info["tokenizer"]
    model = model_info["model"]
    label_map = model_info["label_map"]

    inputs = tokenizer(
        text, return_tensors="pt", truncation=True, max_length=TOKEN_LIMIT
    )

    if isinstance(model, WHLA_BERT) and "token_type_ids" in inputs:
        inputs.pop("token_type_ids")

    with torch.no_grad():
        outputs = model(**inputs)
    logits = outputs.logits

    probabilities = softmax(logits, dim=-1)

    prediction = torch.argmax(probabilities, dim=-1).item()
    confidence = probabilities[0, prediction].item()

    if with_label:
        prediction = label_map[prediction]

    return prediction, confidence


def get_model_mode(model_name: str):
    if model_name not in models:
        raise ValueError(
            f"Invalid model name: {model_name}. Available models: {list(models.keys())}"
        )

    return models[model_name]["mode"]


def predict_with_gradient(text: str, model_name: str):
    if model_name not in models:
        raise ValueError(
            f"Invalid model name: {model_name}. Available models: {list(models.keys())}"
        )

    model_info = models[model_name]
    tokenizer = model_info["tokenizer"]
    model = model_info["model"]
    label_map = model_info["label_map"]

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

    # Map tokens to words
    tokens = tokenizer.convert_ids_to_tokens(input_ids[0])

    filtered_indices = [
        i for i, token in enumerate(tokens) if token not in ["[CLS]", "[SEP]"]
    ]
    filtered_scores = importance_scores[filtered_indices]
    normalized_scores = filtered_scores / filtered_scores.sum()

    # Filter tokens by threshold
    word_importance = [
        {"word": tokens[i], "contribution": normalized_scores[j].item()}
        for j, i in enumerate(filtered_indices)
    ]

    predicted_class = label_map[predicted_class]  # Map to string label

    return predicted_class, confidence, word_importance


def tokenize_datasets(dataset, tokenizer):

    def tokenize_function(data):
        return tokenizer(data["text"], truncation=True, max_length=TOKEN_LIMIT)

    tokenized_dataset = dataset.map(tokenize_function, batched=True)

    return tokenized_dataset


def macro_compute_metrics(pred):
    labels = pred.label_ids
    preds = pred.predictions.argmax(-1)
    precision, recall, f1, _ = precision_recall_fscore_support(
        labels, preds, average="macro"
    )
    acc = accuracy_score(labels, preds)
    return {"accuracy": acc, "f1": f1, "precision": precision, "recall": recall}


def binary_compute_metrics(pred):
    labels = pred.label_ids
    preds = pred.predictions.argmax(-1)
    precision, recall, f1, _ = precision_recall_fscore_support(
        labels, preds, average="binary"
    )
    acc = accuracy_score(labels, preds)
    return {"accuracy": acc, "f1": f1, "precision": precision, "recall": recall}


def evaluate(model_name: str, dataset):
    model_info = models[model_name]
    tokenizer = model_info["tokenizer"]
    model = model_info["model"]
    mode = model_info["mode"]

    original_texts = list(dataset["text"])
    dataset = dataset.cast_column("label", Value("int64"))

    tokenized_dataset = tokenize_datasets(dataset, tokenizer)
    data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

    training_args = TrainingArguments(
        output_dir="./results", per_device_eval_batch_size=1, report_to="none"
    )

    compute_metrics_fn = (
        binary_compute_metrics if mode == "binary" else macro_compute_metrics
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        data_collator=data_collator,
        compute_metrics=compute_metrics_fn,
    )

    try:
        prediction_output = trainer.predict(tokenized_dataset)
    except Exception as e:
        raise ValueError(f"Error during evaluation: {str(e)}")

    raw_predictions = prediction_output.predictions
    tensor_predictions = torch.tensor(raw_predictions)

    probabilities = softmax(tensor_predictions, dim=1)
    probabilities_np = probabilities.numpy()
    predicted_classes = probabilities_np.argmax(axis=1).tolist()
    confidence_scores = [
        float(probabilities[i, pred]) for i, pred in enumerate(predicted_classes)
    ]

    labels = prediction_output.label_ids.tolist()
    metrics = prediction_output.metrics

    result = {
        "texts": original_texts,
        "labels": labels,
        "predicted_classes": predicted_classes,
        "confidence_scores": confidence_scores,
        "metrics": {
            "accuracy": f"{metrics['test_accuracy'] * 100:.1f}%",
            "f1": f"{metrics['test_f1']:.2g}",
            "precision": f"{metrics['test_precision']:.2g}",
            "recall": f"{metrics['test_recall']:.2g}",
            "loss": f"{metrics['test_loss']:.2g}",
        },
        "mode": mode,
        "evaluation_mode": True,
    }

    return result
