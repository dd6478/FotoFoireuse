from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse

from .forms import UserUpdateForm, ProfileUpdateForm
# Create your views here.
def register(request):
    if request.method == "POST":
        username = request.POST['username']
        email = request.POST['email']
        password1 = request.POST['password']
        password2 = request.POST['password2']

        if password1 == password2:
            if User.objects.filter(username=username).exists():
                messages.error(request, 'Username exists! Try another username...')
                return HttpResponseRedirect(reverse('accounts:register'))
            elif User.objects.filter(email=email).exists():
                messages.error(request, 'Email is already taken! Try another one')
                return HttpResponseRedirect(reverse('accounts:register'))
            else:
                user = User.objects.create_user(username=username, email=email, password=password1)
                user.save()
                messages.success(request, 'Account added successfully...')
                return HttpResponseRedirect(reverse('accounts:login'))
        else:
            messages.error(request, 'Passwords did not match!')
            return HttpResponseRedirect(reverse('accounts:register'))
    else:
        return render(request, 'accounts/register.html')


def login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = auth.authenticate(username=username, password=password)

        if user is not None:
            auth.login(request, user)
            messages.success(request, 'Login Successful!')
            return HttpResponseRedirect(reverse('home'))
        else:
            messages.error(request, 'Invalid credentials!')
            return HttpResponseRedirect(reverse('accounts:login'))
    else:
        return render(request, 'accounts/login.html')

def logout(request):
    if request.method == 'POST':
        auth.logout(request)
        messages.success(request, 'Logged out from website.')
        return HttpResponseRedirect(reverse('accounts:login'))

@login_required(login_url='home')
def profile(request, pk):
    context = {}
    account = get_object_or_404(User, id=pk)
    if request.method == 'POST':
        u_form = UserUpdateForm(request.POST, instance=account)
        p_form = ProfileUpdateForm(request.POST, request.FILES, instance=account.profile)
        if u_form.is_valid() and p_form.is_valid():
            u_form.save()
            p_form.save()
            messages.success(request, 'Your account has been updated!')
            return redirect(reverse('accounts:index'))
    else:
        u_form = UserUpdateForm(instance=account)
        p_form = ProfileUpdateForm(instance=account.profile)

    context = {
        'u_form': u_form,
        'p_form': p_form,
        'account': account
    }

    return render(request, 'accounts/profile.html', context)

@login_required(login_url='home')
def index(request):
    context = {
        'accounts_list': User.objects.all()
    }
    return render(request, 'accounts/index.html', context)
