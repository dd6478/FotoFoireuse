import json

from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse, HttpResponseBadRequest
from django.shortcuts import render, get_object_or_404
from django.urls import reverse, reverse_lazy
from django.views import generic
from django.views.decorators.csrf import csrf_exempt

from .forms import QuestionForm, ChoiceForm
from .models import Question, Choice


# Create your views here.


def list_view(request):
    context={}
    context['latest_question_list'] = Question.objects.order_by("-pub_date")[:5]
    return render(request, "polls/index.html", context)

def detail_view(request, pk):
    context={}
    context["question"] = Question.objects.get(id=pk)
    return render(request, "polls/detail.html", context)

def create_view(request):
    context={}
    form = QuestionForm(request.POST or None)
    if form.is_valid():
        form.save()
        return HttpResponseRedirect(reverse("polls:index", args=()))
    context['form'] = form
    return render(request, "polls/create.html", context)
def detail_view(request, pk):
    question = get_object_or_404(Question, id=pk)
    return render(request, "polls/detail.html", {'question': question})

def update_view(request, pk):
    context={}
    obj = get_object_or_404(Question, id=pk)
    form = QuestionForm(request.POST or None, instance=obj)
    if form.is_valid():
        form.save()
        return HttpResponseRedirect(reverse("polls:index", args=()))
    context["form"] = form
    return render(request, "polls/update.html", context)

def delete_view(request, pk):
    context={}
    obj = get_object_or_404(Question, id=pk)
    if request.method == "POST":
        obj.delete()
        return HttpResponseRedirect(reverse("polls:index", args=()))
    return render(request, "polls/delete.html", context)

def create_choice_view(request):
    context={}
    form = ChoiceForm(request.POST or None)
    if form.is_valid():
        form.save()
        return HttpResponseRedirect(reverse("polls:index", args=()))
    context['form'] = form
    return render(request, "polls/create_choice.html", context)

"""class IndexView(generic.ListView):
    template_name = 'polls/index.html'
    context_object_name = 'latest_question_list'

    def get_queryset(self):
        return Question.objects.all()

class DetailView(generic.DetailView):
    model = Question
    template_name = 'polls/detail.html'
"""
class ResultsView(generic.DetailView):
    model = Question
    template_name = 'polls/results.html'

def vote(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    try:
        selected_choice = question.choice_set.get(pk=request.POST['choice'])
    except (KeyError, Choice.DoesNotExist):
        return render(request, 'polls/detail.html', {
            'question': question,
            'error_message': "You didn't select a choice.",
        })
    else:
        selected_choice.votes += 1
        selected_choice.save()
        return HttpResponseRedirect(reverse('polls:results', args=(question.id,)))


"""class CreateView(generic.CreateView):
    model = Question
    form_class = QuestionForm
    template_name = 'polls/create.html'
    success_url = reverse_lazy('polls:index')


class UpdateView(generic.UpdateView):
    model = Question
    fields = ['question_text', 'pub_date']
    template_name = 'polls/update.html'
    success_url = reverse_lazy('polls:index')


class DeleteView(generic.DeleteView):
    model = Question
    template_name = 'polls/delete.html'
    success_url = reverse_lazy('polls:index')


class CreateChoiceView(generic.CreateView):
    model = Choice
    form_class = ChoiceForm
    template_name = 'polls/create_choice.html'
    success_url = reverse_lazy('polls:index')
"""
@login_required
def choice(request):
    context={}
    context['questions'] = Question.objects.all()
    return render(request, "polls/choice.html", context)

def get_choices(request):
    is_ajax = request.headers.get('x-requested-with') == 'XMLHttpRequest'
    if is_ajax:
        if request.method == 'POST':
            data = json.load(request)
            q_id = data.get('question')
            choices = list(Choice.objects.filter(question_id=int(q_id)).values())
            return JsonResponse({"choices": choices})
        return JsonResponse({"status":"invalid request"}, status=400)
    else:
        return HttpResponseBadRequest("Invalid request")

@csrf_exempt
def search_account(request):
    if request.method == 'POST':
        search_text = request.POST.get('search_text')
        accounts = Account.objects.filter(name__icontains=search_text)
        accounts_list = list(accounts.values())
        return JsonResponse({"accounts": accounts_list})
    else:
        return JsonResponse({"error": "Invalid request"}, status=400)