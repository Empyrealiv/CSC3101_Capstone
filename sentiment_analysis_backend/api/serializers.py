from rest_framework import serializers
from .utils import TOKEN_LIMIT

class TextSerializer(serializers.Serializer):
    text = serializers.CharField(max_length=TOKEN_LIMIT)
    model_name = serializers.CharField(max_length=100)

class TextArraySerializer(serializers.Serializer):
    texts = serializers.ListField(
        child=serializers.CharField(max_length=TOKEN_LIMIT)
    )
    model_name = serializers.CharField(max_length=100)