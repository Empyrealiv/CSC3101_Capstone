from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .serializers import TextSerializer, MultiTextSerializer
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
                return Response({"sentiment": "Negative", "confidence": confidence})
            elif sentiment == 1:
                return Response({"sentiment": "Positive", "confidence": confidence})
        return Response(serializer.errors, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def multi_predict_sentiment(request):
    try: 
        serializer = MultiTextSerializer(data=request.data)
        if serializer.is_valid():
            texts = serializer.validated_data['texts']
            model_name = serializer.validated_data['model_name']
            results = []

            for text in texts:
                sentiment, confidence= predict(text, model_name)
                sentiment_label = "Positive" if sentiment == 1 else "Negative"
                results.append({"text": text, "sentiment": sentiment_label, "confidence": confidence})

            responseValue = {"results": results}

            return Response(responseValue)
        else:
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

    csv_file = request.FILES["file"]

    try:
        df = pd.read_csv(csv_file)
        preview_data = df.head().to_dict(orient="records")

        return Response({
            "message": "CSV received successfully!",
            "columns": list(df.columns),
            "preview": preview_data
        })

    except Exception as e:
        return Response({"error": str(e)}, status=400)