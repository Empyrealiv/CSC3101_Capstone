# CSC3101_Capstone

## Description 📖
This repository contains the full code implementation of the CSC3103 Capstone project 'Enhancing NLP Models for Social Media Sentiment Analysis'  
Note*: Due to size limitations, certain elements of the project are current missing from the repository such as large datasets and models  
For more information on how to retrieve those datasets and train the models, please refer to the 'Enhancing NLP Models for Social Media Sentiment Analysis' report, section

## Repository Information
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
    - [Improvement Implementation]
    - [Pre Training Pipelines]
    - [Vocabulary]

## Contact 📬
Ashley Tay Yong Jun
Email: 2200795@sit.singaporetech.edu.sg
GitHub: EmpyreaLiv