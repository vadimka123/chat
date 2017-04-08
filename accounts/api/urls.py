from django.conf.urls import url, include

urlpatterns = [
    url(r'^v1/account/', include('accounts.api.v1.urls')),
]
