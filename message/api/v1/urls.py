from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.MessageListCreateView.as_view()),
]
