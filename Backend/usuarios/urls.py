from django.urls import path
from .views import LoginUsuarioView

urlpatterns = [
    path('login/', LoginUsuarioView.as_view(), name='api_login'),
]