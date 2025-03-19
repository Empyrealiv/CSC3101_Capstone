import React from "react";
import { Container } from "react-bootstrap";
import "../../assets/Documentation/index.css";

export const Documentation = () => {
  return (
    <div className="page-container">
      <Container>
        <h1>API Documentation</h1>
        <span className="endpoint">API URL: http://127.0.0.1:8000/api/</span>
        {/* getModels api */}
        <hr className="separator" />
        <h2 className="heading">Get Models Endpoint</h2>
        <p>
          <strong>GET</strong> <span className="endpoint">/getModels</span>
        </p>

        <h3 className="heading">Response Example:</h3>
        <pre className="code-block">
          <code>
            {`{
      "models": ["Binary SA Base Model","Binary SA Proposed Model","Ternary SA Proposed Model","Emotions SA Proposed Model"]
}`}
          </code>
        </pre>

        {/* predict api */}
        <hr className="separator" />
        <h2 className="heading">Predict Sentiment Endpoint</h2>
        <p>
          <strong>POST</strong> <span className="endpoint">/predict</span>
        </p>

        <h3 className="heading">Request Example:</h3>
        <pre className="code-block">
          <code>
            {`{
    "text": "I am happy", 
    "model_name": "Binary SA Base Model"
}`}
          </code>
        </pre>

        <h3 className="heading">Response Example:</h3>
        <pre className="code-block">
          <code>
            {`{
    "sentiment": "Positive",
    "confidence": 0.9948655962944031
}`}
          </code>
        </pre>

        {/* multi predict api */}
        <hr className="separator" />
        <h2 className="heading">Multi Predict Sentiment Endpoint</h2>
        <p>
          <strong>POST</strong> <span className="endpoint">/multiPredict</span>
        </p>

        <h3 className="heading">Request Example:</h3>
        <pre className="code-block">
          <code>
            {`{
    "texts": ["I am happy", "I am sad"], 
    "model_name": "Binary SA Base Model"
}`}
          </code>
        </pre>

        <h3 className="heading">Response Example:</h3>
        <pre className="code-block">
          <code>
            {`[
    {
        "text": "I am happy",
        "sentiment": "Positive",
        "confidence": 0.9948655962944031
    },
    {
        "text": "I am sad",
        "sentiment": "Negative",
        "confidence": 0.9984952211380005
    }
]`}
          </code>
        </pre>

        {/* upload csv api */}
        <hr className="separator" />
        <h2 className="heading">Upload CSV Endpoint</h2>
        <p>
          <strong>POST</strong> <span className="endpoint">/uploadCSV</span>
        </p>

        <h3 className="heading">Request Example:</h3>
        <pre className="code-block">
          <code>
            curl -X POST -F "file=@test_data.csv" -F "model_name=Binary SA Base
            Model" -F "evaluation_mode=true"
            http://127.0.0.1:8000/api/uploadCSV/
          </code>
        </pre>

        <h3 className="heading">Response Example:</h3>
        <pre className="code-block">
          <code>
            {`{
      "texts":["I am happy","I am sad"],
      "labels":[1,0],
      "predicted_classes":[1,0],
      "confidence_scores":[0.9948655962944031,0.9984952211380005],
      "metrics": {
                    "accuracy":"100.0%",
                    "f1":"1",
                    "precision":"1",
                    "recall":"1",
                    "loss":"0.0033"
                  },
      "mode":"binary",
      "evaluation_mode":true
}`}
          </code>
        </pre>

        {/* upload csv api */}
        <hr className="separator" />
        <h2 className="heading">Predict Sentiment with Importance Endpoint</h2>
        <p>
          <strong>POST</strong> <span className="endpoint">/uploadCSV</span>
        </p>

        <h3 className="heading">Request Example:</h3>
        <pre className="code-block">
          <code>
          {`{
    "text": "I am happy", 
    "model_name": "Binary SA Base Model"
}`}
          </code>
        </pre>

        <h3 className="heading">Response Example:</h3>
        <pre className="code-block">
          <code>
            {`{
    "sentiment": "Positive",
    "confidence": 0.996517539024353,
    "word_importance": [
        {
            "word": "i",
            "contribution": 0.11505351215600967
        },
        {
            "word": "am",
            "contribution": 0.21729467809200287
        },
        {
            "word": "happy",
            "contribution": 0.437175989151001
        },
        {
            "word": "!",
            "contribution": 0.23047584295272827
        }
    ]
}`}
          </code>
        </pre>
      </Container>
    </div>
  );
};
