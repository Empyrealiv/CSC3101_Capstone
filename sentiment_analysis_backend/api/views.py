from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import MessageSerializer

# Create your views here.
@api_view(['GET'])
def hello_world(request):
    data = {"message": "Hello, world!"}
    return Response(data)

@api_view(['POST'])
def echo_message(request):
    # Use the serializer to validate incoming data
    serializer = MessageSerializer(data=request.data)
    if serializer.is_valid():
        message = serializer.validated_data['message']
        return Response({"message": f"You said: {message}"})
    return Response(serializer.errors, status=400)