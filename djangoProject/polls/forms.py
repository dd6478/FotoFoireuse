from django import forms
from django.urls import reverse_lazy
from django.views import generic

from .models import Question, Choice

class QuestionForm(forms.ModelForm):
    class Meta:
        model = Question
        fields = ['question_text', 'pub_date']
        widgets = {
            'question_text': forms.TextInput(attrs={'class': 'form-control'}),
            'pub_date': forms.DateInput(attrs={'type': 'date'})
        }
        labels = {
            'question_text': 'Question',
            'pub_date': 'Date Published'
        }

class ChoiceForm(forms.ModelForm):
    class Meta:
        model = Choice
        fields = ['choice_text', 'votes']
        widgets = {
            'choice_text': forms.TextInput(attrs={'class': 'form-control'}),
            'votes': forms.NumberInput(attrs={'class': 'form-control'})
        }
        labels = {
            'choice_text': 'Choice',
            'votes': 'Votes'
        }
