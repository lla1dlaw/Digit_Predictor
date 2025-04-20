from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template import loader
import json
import requests
from django.views.decorators.csrf import csrf_exempt


def main(request):
    template = loader.get_template('index.html')
    return HttpResponse(template.render())


def get_available_networks(request):
    microservice_url = "http://localhost:8001/get_available_models"
    res = requests.get(microservice_url).json()['available_models']
    return JsonResponse(res, safe=False)


@csrf_exempt
def infer(request):
    microservice_url = 'http://localhost:8001/infer'

    if request.method == "POST": # ensure that the incomming message is through POST
        try:
            body = json.loads(request.body)
            response = requests.post(microservice_url, json=body, headers={"Content-Type": "application/json"}).json()
            return JsonResponse(response, status=200)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'error': f"{request.method} not allowed"}, status=405)

