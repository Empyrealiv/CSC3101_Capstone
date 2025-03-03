from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .serializers import TextSerializer
from .utils import predict
from .utils import models
import pandas as pd

@api_view(['POST'])
def predict_sentiment(request):
    try:
        serializer = TextSerializer(data=request.data)
        if serializer.is_valid():
            text = serializer.validated_data['text']
            model_name = serializer.validated_data['model_name']
            sentiment, confidence = predict(text, model_name)
            if sentiment == 0:
                return Response({"sentiment": "NEGATIVE", "confidence": confidence})
            elif sentiment == 1:
                return Response({"sentiment": "POSITIVE", "confidence": confidence})
        return Response(serializer.errors, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_models(request):
    return Response({"models": list(models.keys())})

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def upload_csv(request):
    if "file" not in request.FILES:
        return Response({"error": "No file provided"}, status=400)

    file = request.FILES["file"]
    model_name = request.POST.get("model_name")

    if not model_name:
        return Response({"error": "Missing model_name parameter"}, status=400)

    try:
        df = pd.read_csv(file)
        if "text" not in df.columns:
            return Response({"error": "Column 'text' not found in CSV file"}, status=400)

        return handleMultiPredict(df["text"], model_name)
        
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    
def handleMultiPredict(texts: pd.Series, model_name: str):
    results = []

    for text in texts:
        sentiment, confidence= predict(text, model_name)
        sentiment_label = "Positive" if sentiment == 1 else "Negative"
        results.append({"text": text, "sentiment": sentiment_label, "confidence": confidence})

    return Response(results, status=200)