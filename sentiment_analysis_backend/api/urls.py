from django.urls import path
from .views import protected_view
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('predict/', views.predict_sentiment, name='predict_sentiment'),
    path('getModels/', views.get_models, name='get_models'),
    path('protected/', views.protected_view, name='protected_view'),
]
