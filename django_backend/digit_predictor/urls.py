from django.urls import path
from . import views

urlpatterns = [
    path('', views.main, name='Predictor'),
    path('get_available_networks', views.get_available_networks, name='get_available_networks')
]