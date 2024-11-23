from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import TextSerializer
from .utils import predict
from .utils import model_list

@api_view(['POST'])
def predict_sentiment(request):
    serializer = TextSerializer(data=request.data)
    if serializer.is_valid():
        text = serializer.validated_data['text']
        sentiment = predict(text)
        if sentiment == 0:
            return Response({"sentiment": "Negative"})
        elif sentiment == 1:
            return Response({"sentiment": "Positive"})
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_models(request):
    return Response({"models": model_list})