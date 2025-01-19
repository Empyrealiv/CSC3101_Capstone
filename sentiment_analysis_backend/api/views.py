from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import TextSerializer, MultiTextSerializer
from .utils import predict
from .utils import models

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
    serializer = MultiTextSerializer(data=request.data)
    if serializer.is_valid():
        texts = serializer.validated_data['texts']
        results = []

        for text in texts:
            sentiment = predict(text)
            sentiment_label = "Positive" if sentiment == 1 else "Negative"
            results.append({"text": text, "sentiment": sentiment_label})

        responseValue = {"results": results}

        return Response(responseValue)
    else:
        return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_models():
    return Response({"models": list(models.keys())})