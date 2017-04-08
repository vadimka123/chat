from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.UserListView.as_view()),
    url(r'^token/refresh/$', views.RefreshJSONWebToken.as_view()),
    url(r'^token/obtain/$', views.ObtainJSONWebToken.as_view()),
    url(r'^token/register/$', views.UserCreate.as_view()),
]
