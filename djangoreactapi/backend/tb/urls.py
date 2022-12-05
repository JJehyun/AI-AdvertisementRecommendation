#backend/tb/urls.py
# djangoreactapi 폴더의 urls.py에서 넘어 와, api/뒤에 붙은 이름에 따라 views.py의 class를 불러와줌
from django.urls import path

from . import views
from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token, refresh_jwt_token

urlpatterns = [
    path('Logout', views.Logout.as_view()),
    path('Login', views.Login.as_view()),
    path('Join', views.Join.as_view()),
    path('UserApi', views.UserApi.as_view()),
    path('UserLogApi', views.UserLogApi.as_view()),
    path('UserNotice', views.UserNotice.as_view()),
    path('UserQnA', views.UserQnA.as_view()),
    path('UserFAQ', views.UserFAQ.as_view()),
    path('UserInfoApi', views.UserInfoApi.as_view()),
    path('VideoApi', views.VideoApi.as_view()),
    path('VideoTagApi', views.VideoTagApi.as_view()),
    path('VideoSearchApi', views.VideoSearchApi.as_view()),
    path('ItemApi', views.ItemApi.as_view()),
    path('ItemCategoryApi', views.ItemCategoryApi.as_view()),
    path('ItemTagApi', views.ItemTagApi.as_view()),
    path('ItemSearchApi', views.ItemSearchApi.as_view()),
    path('BoshowPlayer', views.BoshowPlayer.as_view()),
    path('ProgressProcess', views.ProgressProcess.as_view()),
    path('ItemDetail', views.Item_Detail.as_view()),
    path('MakeSbsToken', views.MakeSbsToken.as_view()),
    path('AdbApi', views.AdbApi.as_view()),
    path('AdbSearchApi', views.AdbSearchApi.as_view()),
    path('AdbMatchVideoApi', views.AdbMatchVideoApi.as_view()),
    path('AdbItems', views.GetAdbItems.as_view()),
    path('VideoTitle', views.GetVideoTitle.as_view()),
    path('YoutubeSearchApi', views.YoutubeSearchApi.as_view()),
    path('FileUploadApi', views.FileUploadApi.as_view()),
    path('EmailCertification', views.EmailCertification.as_view()),
    path('CertificateAuth', views.CertificateAuth.as_view()),
    path('ModifyPW', views.modify_password.as_view()),
    # path('<int:pk>/', views.DetailPost.as_view()),

    path('verify', verify_jwt_token),
    path('refresh', refresh_jwt_token),
]