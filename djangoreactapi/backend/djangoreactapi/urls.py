"""djangoreactapi URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
# 경로 뒤에 /api가 붙어있으면 backend 폴더의 urls.py로 이동 함
from django.conf.urls import url
from django.contrib import admin
import debug_toolbar
from django.urls import path, include
from django.conf import settings

urlpatterns = [
    url('^admin/', admin.site.urls),
    path('api/', include('tb.urls')),
]
if settings.DEBUG:
    urlpatterns += [
        path('__debug__/', include(debug_toolbar.urls)),
    ]