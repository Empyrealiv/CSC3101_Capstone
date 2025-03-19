from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .serializers import TextSerializer, TextArraySerializer
from .utils import predict, get_model_mode, predict_with_gradient, evaluate
from .utils import models
import pandas as pd
from datasets import Dataset


@api_view(["POST"])
def predict_sentiment(request):
    try:
        serializer = TextSerializer(data=request.data)
        if serializer.is_valid():
            text = serializer.validated_data["text"]
            model_name = serializer.validated_data["model_name"]
            sentiment, confidence = predict(text, model_name, with_label=True)
            return Response({"sentiment": sentiment, "confidence": confidence})
        return Response(serializer.errors, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["POST"])
def multi_predict_sentiment(request):
    try:
        serializer = TextArraySerializer(data=request.data)
        if serializer.is_valid():
            texts = serializer.validated_data["texts"]
            model_name = serializer.validated_data["model_name"]

            results = []

            for text in texts:
                sentiment, confidence = predict(text, model_name)

                result = {
                    "text": text,
                    "sentiment": sentiment,
                    "confidence": confidence,
                }
                results.append(result)
            return Response(results)
        return Response(serializer.errors, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["POST"])
def predict_importance(request):
    try:
        serializer = TextSerializer(data=request.data)
        if serializer.is_valid():
            text = serializer.validated_data["text"]
            model_name = serializer.validated_data["model_name"]
            sentiment, confidence, word_importance = predict_with_gradient(
                text, model_name
            )
            print(sentiment)
            return Response(
                {
                    "sentiment": sentiment,
                    "confidence": confidence,
                    "word_importance": word_importance,
                }
            )
        return Response(serializer.errors, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
def get_models(request):
    return Response({"models": list(models.keys())})


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def upload_csv(request):
    if "file" not in request.FILES:
        return Response({"error": "No file provided"}, status=400)

    file = request.FILES["file"]
    model_name = request.POST.get("model_name")
    evaluation_mode = request.POST.get("evaluation_mode")

    if not model_name:
        return Response({"error": "Missing model_name parameter"}, status=400)

    df = pd.read_csv(file)

    print(df.columns)

    try:
        if evaluation_mode == "false":
            if "text" not in df.columns:
                return Response(
                    {"error": "Column 'text' not found in CSV file"}, status=400
                )

            df["text"] = df["text"].astype(str).str.strip()
            df = df[df["text"] != ""]
            df = df[df["text"] != "nan"]

            if len(df["text"]) == 0:
                return Response({"error": "No text found in CSV file"}, status=400)
            print(df["text"])
            return handleMultiPredict(df["text"], model_name)
        else:
            if "text" not in df.columns or "label" not in df.columns:
                return Response(
                    {"error": "Column 'text' or 'label' not found in CSV file"},
                    status=400,
                )

            df = df[["text", "label"]]
            df = clean_df(df)

            if len(df) == 0:
                return Response({"error": "No data found in CSV file"}, status=400)

            dataset = Dataset.from_pandas(df)
            result = evaluate(model_name, dataset)
            return Response(result, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=400)


def handleMultiPredict(texts: pd.Series, model_name: str):
    all_texts = []
    all_predictions = []
    all_confidences = []

    for text in texts:
        sentiment, confidence = predict(text, model_name, with_label=False)
        all_texts.append(text)
        all_predictions.append(sentiment)
        all_confidences.append(confidence)

    mode = get_model_mode(model_name)

    results = {
        "texts": all_texts,
        "predicted_classes": all_predictions,
        "confidence_scores": all_confidences,
        "mode": mode,
        "evaluation_mode": False,
    }

    return Response(results, status=200)


def clean_df(df):
    df["text"] = df["text"].astype(str).str.strip()
    df["label"] = df["label"].astype(str).str.strip()

    df = df[df["text"] != ""]
    df = df[df["text"] != "nan"]

    df = df[df["label"] != ""]
    df = df[df["label"] != "nan"]
    return df
