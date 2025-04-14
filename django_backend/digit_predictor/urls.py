from django.urls import path
from . import views

urlpatterns = [
    path('digit_predictor/', views.test_view, name='Test View'),
]