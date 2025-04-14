from django.shortcuts import render
from django.http import HttpResponse

def test_view(request):
    return HttpResponse("Test View Successful...")

# Create your views here.
