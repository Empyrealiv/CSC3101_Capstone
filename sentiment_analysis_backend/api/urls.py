from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.predict_sentiment, name='predict_sentiment'),
    path('getModels/', views.get_models, name='get_models'),
    path('uploadCSV/', views.upload_csv, name='upload_csv'),
]