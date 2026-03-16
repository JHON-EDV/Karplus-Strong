from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from songs.views import register, health

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/health/', health, name='health'),
    path('api/v1/auth/register/', register, name='register'),
    path('api/v1/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/', include('songs.urls')),
]
