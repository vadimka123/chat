from django.conf.urls import url, include

urlpatterns = [
    url(r'^v1/message/', include('message.api.v1.urls')),
]
