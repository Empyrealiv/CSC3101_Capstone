# Adding and Integrating models into the backend

If you have obtained new or existing models that you wish to implement with the sentiment analysis backend, ensure you follow the existing naming conventions for folder and file names  

The code for the API integration currently only accepts BERT type models and makes use of Hugging Face model loaders and trainers to load the model and perform predictions

1. Place the model into the Models folder

2. If it is a custom model using the WHLA wrapper class from this repository and making using a JSON config and .pth file, ensure the naming convention follows the following  
    - Folder name: Any folder name will work
    - JSON config: [Folder name]_config.json
    - pth file: [Folder name].pth

3. Define the path to the model in the .api/utils.py
    ```
    BASE_MODEL_PATH = os.path.join(
        os.path.dirname(__file__),
        "..",
        "..",
        "sentiment_analysis_backend",
        "Models",
        "base_model",
    )

4. Add the model to the 'models' object to register it under the available model for the API, ensure the model is registered with the correct label map and mode, else errors will occur between the frontend and backend
    ```
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

5. If done correctly, the Django framework will initialize without issues when running the local server