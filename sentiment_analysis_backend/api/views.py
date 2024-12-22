from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
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

@api_view(['POST'])
def login(request):
    username = request.data['username']
    password = request.data['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        response = Response({'Message': 'Login successful'}, status=200)
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=False,
            samesite='Lax',
            path = '/'
        )
        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=False,
            samesite='Lax',
            path = '/'
        )
        return response
    else:
        return Response({"error": "Invalid credentials"}, status=400)

@api_view(['POST'])
def logout(request):
    response = Response({'Message': 'Logout successful'}, status=200)
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    """
    A protected API endpoint that requires authentication.
    """
    return Response({"message": "You are authenticated!", "user": request.user.username})