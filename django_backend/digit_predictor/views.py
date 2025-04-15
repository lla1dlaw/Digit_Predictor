from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from utils.Model_Loader import Loader


def main(request):
    template = loader.get_template('index.html')
    return HttpResponse(template.render())

