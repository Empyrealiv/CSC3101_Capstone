# CSC3101_Capstone

## Description 📖
This repository contains the full code implementation of the CSC3103 Capstone project 'Enhancing NLP Models for Social Media Sentiment Analysis'  

*Note*: Due to size limitations, certain elements of the project are current missing from the repository such as large datasets and models  

For more information on how to retrieve those datasets and train the models, please refer to the 'Enhancing NLP Models for Social Media Sentiment Analysis' report, section 5.2 and 5.3

For access to trained models produced by the training pipelines and used in the sentiment analysis backend, please contact the owner of the repository

## Repository Information 📜
- [ML]
    - [Data Preprocessing] : Contains all relevant code on producing various datasets
        - preprocessing.ipynb produces the pre-training and fine-tuning dataset
        - preprocessing_semeval.ipynb produces the train, eval and test dataset for ternary sentiment analysis
        - preprocessing_emotions produces the dataset for emotions (6 labels) and GoEmotions (28 labels)

    - [Datasets] : Contains the datasets that have cleared the data preprocessing pipelines

    - [Fine Tuning Pipelines] : Contains code for training and producing the various models
        - emotions_pipeline.ipynb produces the emotions classification model for 6 labels with the base BERT model and proposed model architecture
        - finetuning_pipeline.ipynb produces 4 binary sentiment analysis models, the base BERT model, as well as 3 other BERT models with individual enhancements
        - generalization_pipeline.ipynb produces a binary sentiment analysis model trained only on Twitter data for evaluation and comparisons purpose
        - goemotions_pipeline.ipynb produces the emotions classification model for 28 labels with the base BERT model and proposed model architecture
        - proposed_model_pipeline.ipynb produces the binary sentiment analysis model with the proposed model architecture
        - semeval2017_pipeline.ipynb produces the ternary sentiment analysis model with the base BERT model and proposed model architecture

    - [Improvement Implementation] : Contains code on the different enhancements provided to the base BERT model
        - vocab_expansions.ipynb produces the expanded BERT model and tokenizer with slang and emoji
        - vocab_preprocessing.ipynb represents the pipeline used to identify relevant and most used slang and emoji in combined datasets
        - WHLABert.ipynb contains the code for creating the WHLA wrapper around the base BERT model, along with how to save and load the custom model

    - [Pre Training Pipelines] : Contains code for training and producing pretrained models
        - BERT_pretraining (expanded vocab).ipynb contains the pipeline to produce the pretrained BERT model using MLM and an expanded vocabulary
        - BERT_pretraining.ipynb contains the pipeline to produce the pretrained BERT model using MLM ONLY

    - [Vocabulary] : Contains data and info of outputs obtained from the vocab_preprocessing.ipynb file, please read note.txt for more info

- [sentiment_analysis_backend] : Contains the backend code for the web application user interface using Django and Django REST framework

- [sentiment_analysis_frontend] : Contains the frontend code for the web application for rendering the user interface, using ReactJS with TypeScript

## Installation 🛠

This will run a local version of the web application user interface

*Note*: The web application user interface will not work as is without the models loaded into the sentiment analysis backend files

1. **Clone the repository**
   ```sh
   git clone https://github.com/Empyrealiv/CSC3101_Capstone.git
   cd CSC3103_Capstone

2. **Setup ReactJS**
    ```sh
    cd sentiment_analysis_frontend/my-app
    npm install
    npm start

2. **Setup Django**
    ```sh
    cd sentiment_analysis_backend

    // Create a virtual environment [optional]
    cd sentiment_analysis_backend
    python -m venv venv
    .\venv\Scripts\activate

    // Install requirements
    pip install -r requirements.txt
    
    // Run the application
    python.exe .\manage.py runserver

## Contact 📬
Ashley Tay Yong Jun  
Email: 2200795@sit.singaporetech.edu.sg  
GitHub: EmpyreaLiv  