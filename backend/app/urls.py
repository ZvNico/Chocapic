from django.urls import include, path

import hr.urls

urlpatterns = [
    path("__reload__/", include("django_browser_reload.urls")),
    path("", include(hr.urls)),
]
