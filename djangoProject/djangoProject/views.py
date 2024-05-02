from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import generic
from django.shortcuts import render

@login_required(login_url="accounts/login")
def home(request):
    return render(request, 'home.html')