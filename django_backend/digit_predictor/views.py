from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template import loader
import requests


def main(request):
    template = loader.get_template('index.html')
    return HttpResponse(template.render())


def get_available_networks(request):
    microservice_url = "http://localhost:8001/get_available_models"
    res = requests.get(microservice_url).json()['available_models']
    print(type(res))
    return JsonResponse(res, safe=False)

