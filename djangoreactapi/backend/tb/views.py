#backend/post/views.py

# urlencode.Person.encode('utf-8')

#-*- coding:utf-8 -*-
from django.shortcuts import render
from rest_framework import generics
from django.core import serializers
from django import forms
from django.db.models import F
from django.db.models.query import QuerySet
from django.core.files.storage import FileSystemStorage
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.core.mail import EmailMessage
from rest_framework.response import Response
from django.db.models import Q

from .models import Adb
from .serializers import AdbSerializer
from .models import AdbTag
from .models import Video
from .serializers import VideoSerializer
from .models import VideoTag
from .serializers import VideoTagSerializer
from .models import Item
from .serializers import ItemSerializer
from .models import Itemcategory
from .serializers import ItemCategorySerializer
from .models import ItemTag
from .serializers import ItemTagSerializer
from .models import User
from .serializers import UserSerializer
from .models import Company
from .models import Userconnection
from .serializers import UserLogSerializer
from .models import ProcessAi
from .models import ItemDetail
from .serializers import ItemDetailSerializer
from .models import ProcessAi
from .serializers import ProcessSerializer
from .models import Label
from .models import AdbMatching
from .serializers import AdbMatchingSerializer
from .models import Notice
from .serializers import UserNoticeSerializer
from .models import QnA
from .serializers import UserQnASerializer
from .models import Faq
from .serializers import UserFAQSerializer

# 암호화, 복호화 모듈
import json
import bcrypt
import jwt
import torch
import base64
import string
import random
from youtubesearchpython import Video as VideoSearch
from youtubesearchpython import SearchVideos
from time import time

from djangoreactapi.settings import SECRET_KEY

from django.views import View
from django.http import JsonResponse, HttpResponse

from urllib.parse import urlencode
import urllib.request

from .ai.models.experimental import attempt_load
from .ai.models.datasets import letterbox
from .ai.models.general import check_img_size, check_requirements, non_max_suppression, apply_classifier, scale_coords, xyxy2xywh, strip_optimizer, set_logging, increment_path
from .ai.models.plots import plot_one_box
from .ai.models.torch_utils import select_device

import cv2
import glob
import time
import os, sys
import random
import pafy
import shutil
import numpy as np
import math
import requests
from datetime import datetime
import datetime as dte
import datetime as datetimedelta

############# ACGAN #########################################################
import argparse
import json
import glob
import random
import torch.nn as nn
import torch.nn.parallel
import torch.backends.cudnn as cudnn
import torch.optim as optim
import torch.utils.data
import torchvision.datasets as dset
import torchvision.transforms as transforms
from torch.autograd import Variable
from .titan_server.acgan.acgan_network import _netD_result
from .titan_server.acgan.acgan_folder import ImageFolder
from PIL import Image
#############################################################################

imageSize = 128
loader = transforms.Compose([transforms.Resize(imageSize), transforms.CenterCrop(imageSize), transforms.ToTensor(), transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))])

STATIC_DIR = './tb/static/'
MAKE_IMAGE_DIR = STATIC_DIR + 'make_image/'
ADB_IMAGE_DIR = STATIC_DIR + 'advertise_images/'
ITEM_IMAGE_DIR = STATIC_DIR + 'item_image/'
VIDEO_DIR = STATIC_DIR + 'videos/'
ACGAN_IMAGES_PATH = "./tb/titan_server/acgan/images/"
ADBERTISE_IMAGES_DIR = STATIC_DIR + "advertise_images/"
MODEL_DIR = './tb/ai/model/'

ALLOWED_EXTEMSIONS = set(['png'])
ALLOWED_EXTEMSIONS2 = set(['jpg'])
ALLOWED_EXTEMSIONS3 = set(['JPG'])
ALLOWED_EXTEMSIONS4 = set(['PNG'])

_LENGTH = 6 # 6자리

def getUserInfo(token):
    return jwt.decode(token, SECRET_KEY, algorithm="HS256")

class Logout(generics.ListCreateAPIView):
    def __init__(self):
        print("Logout INIT")

    def post(self, request):
        boshow_token = request.GET.get("boshow_token")
        user_idx = getUserInfo(boshow_token)['idx']

        user_connection = Userconnection.objects.filter(fk_user_idx=user_idx).last()
        user_connection.logout_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        user_connection.save()
        
        # usercon = Userconnection.objects.annotate(user_id=F('fk_user_idx__id'), user_name=F('fk_user_idx__name'), user_tier=F('fk_user_idx__tier'), user_dept=F('fk_user_idx__dept'), user_disabled=F('fk_user_idx__disabled_user_status')).filter(fk_user_idx=user_idx, user_disabled=1).order_by('-pk')[0].idx
        # user_idx = Userconnection.objects.annotate(user_id=F('fk_user_idx__id'), user_name=F('fk_user_idx__name'), user_tier=F('fk_user_idx__tier'), user_dept=F('fk_user_idx__dept'), user_disabled=F('fk_user_idx__disabled_user_status')).filter(fk_user_idx=user_idx, user_disabled=1).order_by('-pk')[0].fk_user_idx
        # usercond = Userconnection.objects.get(idx=usercon, fk_user_idx=user_idx)
        # usercond.logout_time = (datetime.now()).strftime('%Y-%m-%d %H:%M:%S')
        # usercond.save()
        #userLog = Userconnection(
        #    login_time = usercon,
        #    logout_time = (datetime.now()).strftime('%Y-%m-%d %H:%M:%S'),
        #)
        #userLog.fk_user_idx = User.objects.filter(id=user_id, disabled_user_status=1).first()
        # usercond.login_time = usercond.login_time
        # usercond.logout_time = (datetime.now()).strftime('%Y-%m-%d %H:%M:%S')
        #userLog.save()
        return Response(status=200)
        
class Login(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def post(self, request):
        self.user_id = request.GET.get("user_id")
        self.user_pw = request.GET.get("user_pw")
        self.company = request.GET.get("company")

        user = User.objects.filter(id=self.user_id, disabled_user_status=1).first()

        # 유저 아이디 존재하지 않음
        if user is None:
            return HttpResponse()

        # 회사명 틀림
        if user.fk_company_idx.name != self.company:
            return HttpResponse()

        # 탈퇴된 회원
        # if user.disabled_user_status != 1:
        #    return HttpResponse()

        #---------비밀번호 확인--------#
        # 사용자가 입력한 비밀번호를 인코딩하고, 사용자의 이메일과 매칭되는 DB의 비밀번호를 찾아와서 인코딩. 이 두 값을 bcrypt.checkpw로 비교하면 됨

        user = User.objects.get(id = self.user_id, disabled_user_status=1)

        print(user.idx)
        # 비밀번호 틀림
        if not bcrypt.checkpw(self.user_pw.encode('utf-8'), user.pw.encode('utf-8')):
            return HttpResponse()


        #----------토큰 발행----------#
        token = jwt.encode({"idx": user.idx, "id" : user.id, "name": user.name}, SECRET_KEY, algorithm = "HS256")

        userLog = Userconnection(
            login_time = datetime.now(),
            logout_time = None,
        )
        userLog.fk_user_idx = User.objects.filter(id=user.id, disabled_user_status=1).first()
        userLog.save()

        # return Response(token, status=200)    # 토큰을 담아서 응답
        return Response(token)    # 토큰을 담아서 응답

class Join(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    def __init__(self):
        print("Join INIT")
        
    def post(self, request):
        request.encoding = 'utf-8'
        print("[Join START...]")
        self.user_id = request.GET.get("user_id")
        self.user_pw = request.GET.get("user_pw")
            
        # 회사 확인
        self.company = request.GET.get("company")
        company = Company.objects.filter(name=self.company).first()
        if company is None:
            return Response()

        self.user_email = request.GET.get("user_email")
        self.user_name = request.GET.get("user_name")
        self.dept = request.GET.get("dept")
        self.phone_number = request.GET.get("phone_number")
        
        password = self.user_pw.encode('utf-8')                 # 입력된 패스워드를 바이트 형태로 인코딩
        password_crypt = bcrypt.hashpw(password, bcrypt.gensalt())  # 암호화된 비밀번호 생성
        Person = User(
            id = self.user_id,
            email = self.user_email,
            pw = password_crypt,
            name = self.user_name,
            fk_company_idx = Company.objects.get(name=self.company),
            dept = self.dept,
            phone = self.phone_number,
            tier = 1,
            status = True,
            tier_modify_notify = 1,
            admin_notify = 1,
            disabled_user_status = 1,
        )
        Person.save()
        return Response(True)

class VideoSearchApi(generics.ListCreateAPIView):
    def __init__(self):
        print("VideoSearchApi INIT")

    def post(self, request):
        mode = request.GET.get('mode')
        if mode != '' and mode == 'trash':
            title = request.GET.get('title')
            token = request.GET.get('boshow_token')
            user_idx = getUserInfo(token)["idx"]
            if title != '':
                video = Video.objects.filter(fk_user_idx=user_idx, title__icontains=str(title), disabled_video_status=0).annotate(user_name=F('fk_user_idx__name'), user_tier=F('fk_user_idx__tier')).order_by('-idx').all()
                serializer_class = VideoSerializer(video, many=True)
                return Response(serializer_class.data, status=200)
            else:
                video = Video.objects.filter(fk_user_idx=user_idx, disabled_video_status=0).annotate(user_name=F('fk_user_idx__name'), user_tier=F('fk_user_idx__tier')).order_by('-idx').all()
                serializer_class = VideoSerializer(video, many=True)
                return Response(serializer_class.data, status=200)
        title = request.GET.get('searchtitle')
        sDate = request.GET.get('searchStartDate')
        eDate = request.GET.get('searchEndDate')
        adder = request.GET.get('searchadder')
        today = datetimedelta.date.today()

        if title != '' and adder != '' and sDate != '' and eDate != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user_idx = User.objects.filter(name__icontains=adder).all()
            user_idx = [int(i.idx) for i in user_idx]
            video = Video.objects.filter(title__icontains=title, disabled_video_status=1).filter(fk_user_idx__in=user_idx).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).annotate(user_name=F('fk_user_idx__name'), user_tier=F('fk_user_idx__tier')).order_by('-idx').all()
            serializer_class = VideoSerializer(video, many=True)
            return Response(serializer_class.data, status=200)
        
        if title != '' and sDate != '' and eDate != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            video = Video.objects.filter(title__icontains=title, disabled_video_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).annotate(user_name=F('fk_user_idx__name'), user_tier=F('fk_user_idx__tier')).order_by('-idx').all()
            serializer_class = VideoSerializer(video, many=True)
            return Response(serializer_class.data, status=200)
        
        if sDate != '' and eDate != '' and adder != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user_idx = User.objects.filter(name__icontains=adder).all()
            user_idx = [int(i.idx) for i in user_idx]
            video = Video.objects.filter(fk_user_idx__in=user_idx, disabled_video_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).annotate(user_name=F('fk_user_idx__name'), user_tier=F('fk_user_idx__tier')).order_by('-idx').all()
            serializer_class = VideoSerializer(video, many=True)
            return Response(serializer_class.data, status=200)
        
        if sDate != '' and eDate != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            video = Video.objects.filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)], disabled_video_status=1).annotate(user_name=F('fk_user_idx__name'), user_tier=F('fk_user_idx__tier')).order_by('-idx').all()
            serializer_class = VideoSerializer(video, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and adder != '':
            user_idx = User.objects.filter(name__icontains=adder).all()
            user_idx = [int(i.idx) for i in user_idx]
            video = Video.objects.filter(title__icontains=title, disabled_video_status=1).filter(fk_user_idx__in=user_idx).annotate(user_name=F('fk_user_idx__name'), user_tier=F('fk_user_idx__tier')).order_by('-idx').all()
            serializer_class = VideoSerializer(video, many=True)
            return Response(serializer_class.data, status=200)

        if title != '':
            video = Video.objects.filter(title__icontains=str(title), disabled_video_status=1).annotate(user_name=F('fk_user_idx__name'), user_tier=F('fk_user_idx__tier')).order_by('-idx').all()
            serializer_class = VideoSerializer(video, many=True)
            return Response(serializer_class.data, status=200)

        if adder != '':
            user_idx = User.objects.filter(name__icontains=adder).all()
            user_idx = [int(i.idx) for i in user_idx]
            video = Video.objects.filter(fk_user_idx__in=user_idx, disabled_video_status=1).annotate(user_name=F('fk_user_idx__name'), user_tier=F('fk_user_idx__tier')).order_by('-idx').all()
            serializer_class = VideoSerializer(video, many=True)
            return Response(serializer_class.data, status=200)
        return Response(status=203)

class VideoApi(generics.ListCreateAPIView):
    # video = Video.objects.all()
    # serializer_class = VideoSerializer
    def __init__(self):
        print("VideoApi INIT")

    def get(self, request):
        mode = request.GET.get('mode')
        if mode != '' and mode == 'trash':
            token = request.GET.get('boshow_token')
            user_idx = getUserInfo(token)["idx"]
            video = Video.objects.annotate(user_name=F('fk_user_idx__name'), user_tier=F('fk_user_idx__tier')).order_by('-idx').filter(fk_user_idx=user_idx, disabled_video_status=0).all()
            serializer_class = VideoSerializer(video, many=True)
            return Response(serializer_class.data, status=200)
        url = request.GET.get('url')
        platform = request.GET.get('platform')
        video_idx = request.GET.get('video_idx')
        platform_list = ['SBS', 'YOUTUBE']
        #user_id = getUserInfo(self.boshow_token)["id"]
        if platform in platform_list:
            if platform == platform_list[1]:
                vPafy = pafy.new(url)
                url = vPafy.getbest(preftype="mp4").url

            cap = cv2.VideoCapture(url)
            fps = cap.get(cv2.CAP_PROP_FPS)
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            duration = frame_count/fps

            return Response(duration)

        if video_idx is not None:
            video = Video.objects.annotate(user_name=F('fk_user_idx__name'), user_tier=F('fk_user_idx__tier')).filter(idx=video_idx).all()
            serializer_class = VideoSerializer(video, many=True)
            return Response(serializer_class.data)

        video = Video.objects.annotate(user_name=F('fk_user_idx__name'), user_tier=F('fk_user_idx__tier')).order_by('-idx').filter(disabled_video_status=1).all()
        serializer_class = VideoSerializer(video, many=True)

        return Response(serializer_class.data)

    def post(self, request):
        self.title = request.POST['title']
        self.description = request.POST['description']
        self.explanation = request.POST['explanation']
        self.tag = request.POST['tag']
        self.duration = request.POST['duration']
        self.platform = request.POST['platform']
        self.url = request.POST['url']
        self.thumbnail = request.POST['thumbnail']
        self.category = request.POST['category']
        self.video = request.FILES.get("files")
        self.boshow_token = request.POST['boshow_token']
        print(self.duration)

        user_id = getUserInfo(self.boshow_token)["id"]

        new_video = Video(
            title = self.title,
            description = self.description,
            duration = 0,
            platform = self.platform,
            view = 0,
            url = self.url,
            thumbnail = self.thumbnail,
            category = self.category,
            upload_time = datetime.now(),
            ai_connection = 0,
            transmission_status = 0,
            disabled_video_status = 1,
        )
        new_video.fk_user_idx = User.objects.filter(id=user_id, disabled_user_status=1).first()

        new_video.save()

        create_video = new_video.idx

        if self.tag and self.tag != '':
            tags = self.tag.split(',')
            for tag in tags:
                new_video_tag = VideoTag(
                    fk_video_idx = Video.objects.get(idx=create_video),
                    tag = tag
                )
                new_video_tag.save()

        if self.video and self.video != '':
            self.videoFileUpload(create_video, self.video)
            new_video.thumbnail = VIDEO_DIR + str(create_video) + "_thumbnail.jpg"
            new_video.save()

        platform_list = ['SBS', 'YOUTUBE', '직접 업로드']

        if self.platform in self.platform:
            if self.platform == platform_list[1]:
                vPafy = pafy.new(self.url)
                url = vPafy.getbest(preftype="mp4").url
            elif self.platform == platform_list[2]:
                url = VIDEO_DIR + str(new_video.idx) + '.' + self.url
            cap = cv2.VideoCapture(url)
            fps = cap.get(cv2.CAP_PROP_FPS)
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            duration = frame_count/fps

            print(frame_count)
            new_video.total_frame = frame_count
            new_video.duration = int(duration)
        else:
            new_video.duration = self.duration
        new_video.save()
        
        return Response(True)

    def delete(self, request):
        self.idx = request.GET.get("video_idx")

        delete_video = Video.objects.get(idx=self.idx)
        delete_video.disabled_video_status = 0
        delete_video.save()
        # for video_idx in self.video_list:
        # delete_video.delete()
        # Video.objects.delete(idx=self.video_list)
        
        return Response(True)

    def put(self, request):
        mode = request.GET.get("mode")
        if mode != '' and mode == 'recovery':
            user_idx = request.GET.get('user_idx')
            recovery_video = request.GET.getlist('Svideo[]')
            for i in recovery_video:
                recovery = json.loads(i)
                videoList = Video.objects.get(fk_user_idx=user_idx, idx=recovery['idx'], disabled_video_status=0)
                videoList.disabled_video_status = 1
                videoList.save()
            return Response(True)
        if mode != '' and mode == 'transmission':
            token = request.GET.get('token')
            user_idx = getUserInfo(token)["idx"]
            print(user_idx)
            idx = request.GET.get('idx')
            transmission = request.GET.get('transmission')
            video = Video.objects.get(idx=idx)
            video.transmission_status = transmission
            video.save()
            return Response(True)
        self.idx = request.GET.get("update_idx")
        self.title = request.GET.get("update_title")
        self.description = request.GET.get("update_description")
        self.category = request.GET.get("update_category")
        self.tag = request.GET.getlist("update_tag[]")

        update_video = Video.objects.get(idx=self.idx)
        
        if update_video is not None:
            # progress.fk_video_idx = Video.objects.get(idx=self.video_idx),
            update_video.title = self.title
            update_video.description = self.description
            update_video.category = self.category
            update_video.save()

            if self.tag and self.tag != '':
                video_tag = VideoTag.objects.filter(fk_video_idx=self.idx).all()
                video_tag.delete()

                for tag in self.tag:
                    new_video_tag = VideoTag(
                        fk_video_idx = Video.objects.get(idx=self.idx),
                        tag = tag
                    )
                    new_video_tag.save()

            return Response(True)

    def videoFileUpload(self, idx, video):
        print(idx)
        video_url = VIDEO_DIR + str(idx) + ".mp4"
        default_storage.save(video_url, ContentFile(video.read()))

        cap = cv2.VideoCapture(video_url)
        retval, image = cap.read()
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frame = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = total_frame/fps
        duration = int(duration)

        # update_duration_video = Video.objects.get(idx=idx)
        # update_duration_video.duration = str(duration)
        # update_duration_video.total_frame = str(total_frame)
        # update_duration_video.save()
        cv2.imwrite(VIDEO_DIR + str(idx) + "_thumbnail.jpg", image)

class VideoTagApi(generics.ListCreateAPIView):
    def __init__(self):
        print("VideoTagApi INIT")

    def get(self, request):
        video_tag = VideoTag.objects.all()
        serializer_class = VideoTagSerializer(video_tag, many=True)

        return Response(serializer_class.data)

class GetVideoTitle(generics.ListCreateAPIView):
    def __init__(self):
        print("GetVideoTitle")

    def get(self, request):
        video_id = request.GET.get('video_id')
        video = Video.objects.filter(url__endswith=video_id).first()
        
        if video is not None:
            video.view += 1
            video.save()
        serializer_class = VideoSerializer(video, many=False)

        return Response(serializer_class.data, status=200)

class UserInfoApi(generics.ListCreateAPIView):
    def __init__(self):
        print("UserInfoApi INIT")

    def get(self, request):
        token = request.GET.get('boshow_token')
        user_idx = getUserInfo(token)['idx']
        userInfo = User.objects.filter(idx=user_idx, disabled_user_status=1)
        serializer_class = UserSerializer(userInfo, many=True)

        return Response(serializer_class.data, status=200)

    def put(self, request):
        mode = request.GET.get("modify_mode")
        idx = request.GET.get("idx")
        update_user = User.objects.get(idx=idx, disabled_user_status=1)

        if mode == "user_info":
            pw = request.GET.get("pw")
            dept = request.GET.get("dept")
            phone = request.GET.get("phone")
            email = request.GET.get("email")
            pw = pw.encode('utf-8')
            pw_crypt = bcrypt.hashpw(pw, bcrypt.gensalt())
            #print(idx, pw_crypt)
            if update_user is not None:
                update_user.pw = pw_crypt 
                update_user.dept = dept 
                update_user.phone = phone[3:]
                update_user.email = email 
                update_user.save()
            return Response(True)
        elif mode == "notify":
            tierM = request.GET.get("tier_modify")
            adminM = request.GET.get("admin_modify")
            tierM = 1 if tierM == "true" else 0
            adminM = 1 if adminM == "true" else 0
            #print(tierM, adminM)
            if update_user is not None: 
                update_user.tier_modify_notify = tierM
                update_user.admin_notify = adminM 
                update_user.save()
            return Response(True)
        return Response(False)

    def delete(self, request):
        user_idx = request.GET.get('idx')
        user_id = request.GET.get('user_id')
        email = request.GET.get('email')
        disabled = request.GET.get('disabled')
        print(user_idx, user_id, email, disabled)
        userInfoCheck = User.objects.filter(idx=user_idx, id=user_id, email=email, disabled_user_status=1)
        if userInfoCheck is not None:
            userInfo = User.objects.get(idx=user_idx, id=user_id, email=email, disabled_user_status=1)
            userInfo.disabled_user_status = int(disabled)
            userInfo.save()
        #serializer_class = UserSerializer(userInfo, many=True)

        return Response(status=200)

class UserLogApi(generics.ListCreateAPIView):
    def __init__(self):
        print("UserLogApi INIT")

    def get(self, request):
        user = Userconnection.objects.annotate(user_id=F('fk_user_idx__id'), user_name=F('fk_user_idx__name'), user_tier=F('fk_user_idx__tier'), user_dept=F('fk_user_idx__dept'), user_disabled=F('fk_user_idx__disabled_user_status')).filter(user_disabled=1).order_by('-idx').all()
        serializer_class = UserLogSerializer(user, many=True)
        return Response(serializer_class.data, status=200)

    def post(self, request):
        token = request.GET.get('token')
        user_idx = getUserInfo(token)["idx"]
        user = User.objects.filter(idx=user_idx).first().name
        return Response(user, status=200)

class UserNotice(generics.ListCreateAPIView):
    def __init__(self):
        print("UserNotice INIT")

    def get(self, request):
        mode = request.GET.get('mode')
        if mode != '' and mode == "checkList":
            idx = int(request.GET.get('idx'))
            views_user = Notice.objects.get(idx=idx)
            views_user.views += 1
            views_user.save()
            if idx == 1:
                notice_user = Notice.objects.filter(idx__range=[idx, idx+1]).annotate(user_name=F('fk_user_idx__name')).all()
            elif idx == int(Notice.objects.last().idx):
                notice_user = Notice.objects.filter(idx__range=[idx-1, idx]).annotate(user_name=F('fk_user_idx__name')).all()
            else:
                notice_user = Notice.objects.filter(idx__range=[idx-1, idx+1]).annotate(user_name=F('fk_user_idx__name')).all()
            serializer_class = UserNoticeSerializer(notice_user, many=True)
            return Response(serializer_class.data, status=200)
        if mode != '' and mode == "views":
            notice_user = Notice.objects.annotate(user_name=F('fk_user_idx__name')).order_by('-views').all()
            serializer_class = UserNoticeSerializer(notice_user, many=True)
            return Response(serializer_class.data, status=200)
        user = Notice.objects.annotate(user_name=F('fk_user_idx__name')).all()
        serializer_class = UserNoticeSerializer(user, many=True)
        return Response(serializer_class.data, status=200)

class UserQnA(generics.ListCreateAPIView):
    def __init__(self):
        print("UserQnA INIT")

    def get(self, request):
        objects = []
        mode = request.GET.get('mode')
        token = request.GET.get('token')
        if mode != '' and mode == 'selected':
            values = request.GET.get('values')
            user_idx = getUserInfo(token)["idx"]
            user_tier = User.objects.filter(idx=user_idx).first().tier
            if user_tier == 0 or user_tier == 3:
                user = QnA.objects.filter(type=values).annotate(user_name=F('fk_user_idx__name')).order_by("-idx").all()
                serializer_class = UserQnASerializer(user, many=True)
                objects.append({"data": serializer_class.data, "tier": user_tier})
                return Response(objects, status=200)
            user = QnA.objects.filter(fk_user_idx=user_idx, type=values).annotate(user_name=F('fk_user_idx__name')).order_by("-idx").all()
            serializer_class = UserQnASerializer(user, many=True)
            objects.append({"data": serializer_class.data, "tier": user_tier})

        user_idx = getUserInfo(token)["idx"]
        user_tier = User.objects.filter(idx=user_idx).first().tier
        if user_tier == 0 or user_tier == 3:
            user = QnA.objects.annotate(user_name=F('fk_user_idx__name')).order_by("-idx").all()
            serializer_class = UserQnASerializer(user, many=True)
            objects.append({"data": serializer_class.data, "tier": user_tier})
            return Response(objects, status=200)
        user = QnA.objects.filter(fk_user_idx=user_idx).annotate(user_name=F('fk_user_idx__name')).order_by("-idx").all()
        serializer_class = UserQnASerializer(user, many=True)
        objects.append({"data": serializer_class.data, "tier": user_tier})
        return Response(objects, status=200)

    def post(self, request):
        file_len = request.POST['file_len']
        token = request.POST['token']
        user_idx = getUserInfo(token)["idx"]
        title = request.POST['title']
        type = request.POST['type']
        contents = request.POST['contents']

        new_QnA = QnA(
            title = title,
            contents = contents,
            type = type,
            answer = None,
            status = 0,
            upload_time = datetime.now(),
        )
        new_QnA.fk_user_idx = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
        new_QnA.save()
        for i in range(0, int(file_len)):
            image = request.data.getlist('files_'+str(i))
            for obj in image:
                path = default_storage.save("./tb/static/QnA_image/"+str(new_QnA.idx)+"/"+str(new_QnA.idx)+"_"+str(i)+".png", ContentFile(obj.read()))
        return Response(status=200)

    def put(self, request):
        mode = request.GET.get('mode')
        if mode != '' and mode == "QnAModify":
            answer = request.GET.get('answer')
            idx = request.GET.get('idx')
            print(answer, idx) 
        answer = request.GET.get('answer')
        token = request.GET.get('token')
        user_idx = getUserInfo(token)["idx"]
        user_name = User.objects.filter(idx=user_idx).first().name
        idx = request.GET.get('idx')
        userQnA = QnA.objects.get(idx=idx)
        userQnA.answer = answer
        userQnA.answered_name = user_name
        userQnA.answered_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        userQnA.status = 1
        userQnA.save()
        return Response(status=200)

class UserFAQ(generics.ListCreateAPIView):
    def __init__(self):
        print("UserFAQ INIT")

    def get(self, request):
        objects = []
        mode = request.GET.get('mode')
        if mode != '' and mode == 'selected':
            values = request.GET.get('values')
            user = Faq.objects.filter(type=values).annotate(user_name=F('fk_user_idx__name')).order_by('-views').all()
            serializer_class = UserFAQSerializer(user, many=True)
            return Response(serializer_class.data, status=200)
        user = Faq.objects.annotate(user_name=F('fk_user_idx__name')).order_by('-views').all()
        serializer_class = UserFAQSerializer(user, many=True)
        return Response(serializer_class.data, status=200)

    def put(self, request):
        idx = request.GET.get('idx')
        userFAQ = Faq.objects.get(idx=idx)
        userFAQ.views += 1
        userFAQ.save()
        return Response(status=200)

class UserApi(generics.ListCreateAPIView):
    def __init__(self):
        print("UserApi INIT")

    def get(self, request):
        #userCheck = request.Get.get('userCheck')
        user = User.objects.filter(disabled_user_status=1).all()
        serializer_class = UserSerializer(user, many=True)

        return Response(serializer_class.data, status=200)

    def post(self, request):
        try:
            self.modify_list = request.GET.getlist("modify_list[]")
            for i in self.modify_list:
                modify = json.loads(i)
                userList = User.objects.get(idx=modify['user_idx'], disabled_user_status=1)
                if userList is not None:
                    userList.tier = modify['tier']
                    userList.status = modify['status']
                    userList.save()
            return Response(status=200)
        except:
            return Response(status=500)

class ItemSearchApi(generics.ListCreateAPIView):
    def __init__(self):
        print("ItemSearchApi INIT")

    def post(self, request):
        mode = request.GET.get('mode')
        if mode != '' and mode == 'trash':
            title = request.GET.get('title')
            token = request.GET.get('boshow_token')
            user_idx = getUserInfo(token)["idx"]
            if title != '':
                item = Item.objects.filter(fk_user_idx=user_idx, title__icontains=str(title), disabled_item_status=0).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            else:
                item = Item.objects.filter(fk_user_idx=user_idx, disabled_item_status=0).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)

        token = request.GET.get('boshow_token')
        user_idx = getUserInfo(token)["idx"]
        title = request.GET.get('searchtitle')
        sDate = request.GET.get('searchStartDate')
        eDate = request.GET.get('searchEndDate')
        level_0 = request.GET.get('level_0')
        level_1 = request.GET.get('level_1')
        level_2 = request.GET.get('level_2')
        level_3 = request.GET.get('level_3')

        if title != '' and sDate != '' and eDate != '' and level_0 != '' and level_1 != '' and level_2 != '' and level_3 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_2, fk_category_level3=level_3, title__icontains=title).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)], disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_2, fk_category_level3=level_3, title__icontains=title).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)], disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and sDate != '' and eDate != '' and level_0 != '' and level_1 != '' and level_2 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_2, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_2, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and sDate != '' and eDate != '' and level_0 != '' and level_1 != '' and level_3 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_3, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_3, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and sDate != '' and eDate != '' and level_0 != '' and level_2 != '' and level_3 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, fk_category_level2=level_2, fk_category_level3=level_3, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level2=level_2, fk_category_level3=level_3, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and sDate != '' and eDate != '' and level_1 != '' and level_2 != '' and level_3 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level1=level_1, fk_category_level2=level_2, fk_category_level3=level_3, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level1=level_1, fk_category_level2=level_2, fk_category_level3=level_3, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and sDate != '' and eDate != '' and level_0 != '' and level_1 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, fk_category_level1=level_1, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level1=level_1, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and sDate != '' and eDate != '' and level_0 != '' and level_2 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, fk_category_level2=level_2, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level2=level_2, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and sDate != '' and eDate != '' and level_0 != '' and level_3 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, fk_category_level3=level_3, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level3=level_3, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and sDate != '' and eDate != '' and level_1 != '' and level_2 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level1=level_1, fk_category_level2=level_2, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level1=level_1, fk_category_level2=level_2, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and sDate != '' and eDate != '' and level_1 != '' and level_3 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level1=level_1, fk_category_level3=level_3, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level1=level_1, fk_category_level3=level_3, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and sDate != '' and eDate != '' and level_2 != '' and level_3 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level2=level_2, fk_category_level3=level_3, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level2=level_2, fk_category_level3=level_3, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and sDate != '' and eDate != '' and level_0 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and sDate != '' and eDate != '' and level_1 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level1=level_1, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level1=level_1, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and sDate != '' and eDate != '' and level_2 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level2=level_2, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level2=level_2, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and sDate != '' and eDate != '' and level_3 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level3=level_3, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level3=level_3, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if sDate != '' and eDate != '' and level_0 != '' and level_1 != '' and level_2 != '' and level_3 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_2, fk_category_level3=level_3, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_2, fk_category_level3=level_3, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if sDate != '' and eDate != '' and level_0 != '' and level_1 != '' and level_2 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_2, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_2, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if sDate != '' and eDate != '' and level_0 != '' and level_1 != '' and level_3 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_3, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_3, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if sDate != '' and eDate != '' and level_0 != '' and level_2 != '' and level_3 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, fk_category_level1=level_2, fk_category_level3=level_3, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level2=level_2, fk_category_level3=level_3, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if sDate != '' and eDate != '' and level_1 != '' and level_2 != '' and level_3 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level1=level_1, fk_category_level2=level_2, fk_category_level3=level_3, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level1=level_1, fk_category_level2=level_2, fk_category_level3=level_3, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if sDate != '' and eDate != '' and level_0 != '' and level_1 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, fk_category_level1=level_1, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level1=level_1, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if sDate != '' and eDate != '' and level_0 != '' and level_2 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, fk_category_level2=level_2, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level2=level_2, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if sDate != '' and eDate != '' and level_0 != '' and level_3 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, fk_category_level3=level_3, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level3=level_3, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if sDate != '' and eDate != '' and level_1 != '' and level_2 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level1=level_1, fk_category_level2=level_2, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level1=level_1, fk_category_level2=level_2, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if sDate != '' and eDate != '' and level_1 != '' and level_3 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level1=level_1, fk_category_level3=level_3, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level1=level_1, fk_category_level3=level_3, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if sDate != '' and eDate != '' and level_2 != '' and level_3 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level2=level_2, fk_category_level3=level_3, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level2=level_2, fk_category_level3=level_3, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if sDate != '' and eDate != '' and level_0 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if sDate != '' and eDate != '' and level_1 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level1=level_1, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level1=level_1, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if sDate != '' and eDate != '' and level_2 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level2=level_2, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level2=level_2, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if sDate != '' and eDate != '' and level_3 != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level3=level_3, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level3=level_3, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and level_0 != '' and level_1 != '' and level_2 != '' and level_3 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(title__icontains=str(title), fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_2, fk_category_level3=level_3, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(title__icontains=str(title), fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_2, fk_category_level3=level_3, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and level_0 != '' and level_1 != '' and level_2 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(title__icontains=str(title), fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_2, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(title__icontains=str(title), fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_2, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and level_0 != '' and level_1 != '' and level_3 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_3, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(title__icontains=str(title), fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_3, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and level_0 != '' and level_2 != '' and level_3 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, fk_category_level2=level_2, fk_category_level3=level_3, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(title__icontains=str(title), fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level2=level_2, fk_category_level3=level_3, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and level_1 != '' and level_2 != '' and level_3 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(title__icontains=str(title), fk_category_level1=level_1, fk_category_level2=level_2, fk_category_level3=level_3, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(title__icontains=str(title), fk_user_idx=user.idx, fk_category_level1=level_1, fk_category_level2=level_2, fk_category_level3=level_3, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and level_0 != '' and level_1 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(title__icontains=str(title), fk_category_level0=level_0, fk_category_level1=level_1, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(title__icontains=str(title), fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level1=level_1, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and level_0 != '' and level_2 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(title__icontains=str(title), fk_category_level0=level_0, fk_category_level2=level_2, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(title__icontains=str(title), fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level2=level_2, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and level_0 != '' and level_3 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(title__icontains=str(title), fk_category_level0=level_0, fk_category_level3=level_3, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(title__icontains=str(title), fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level3=level_3, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and level_1 != '' and level_2 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(title__icontains=str(title), fk_category_level1=level_1, fk_category_level2=level_2, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(title__icontains=str(title), fk_user_idx=user.idx, fk_category_level1=level_1, fk_category_level2=level_2, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and level_1 != '' and level_3 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(title__icontains=str(title), fk_category_level1=level_1, fk_category_level3=level_3, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(title__icontains=str(title), fk_user_idx=user.idx, fk_category_level1=level_1, fk_category_level3=level_3, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and level_2 != '' and level_3 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(title__icontains=str(title), fk_category_level2=level_2, fk_category_level3=level_3, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(title__icontains=str(title), fk_user_idx=user.idx, fk_category_level2=level_2, fk_category_level3=level_3, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and level_0 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(title__icontains=str(title), fk_category_level0=level_0, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(title__icontains=str(title), fk_user_idx=user.idx, fk_category_level0=level_0, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and level_1 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(title__icontains=str(title), fk_category_level1=level_1, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(title__icontains=str(title), fk_user_idx=user.idx, fk_category_level1=level_1, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and level_2 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(title__icontains=str(title), fk_category_level2=level_2, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(title__icontains=str(title), fk_user_idx=user.idx, fk_category_level2=level_2, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and level_3 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(title__icontains=str(title), fk_category_level3=level_3, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(title__icontains=str(title), fk_user_idx=user.idx, fk_category_level3=level_3, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '' and sDate != '' and eDate != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, title__icontains=title, disabled_item_status=1).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if sDate != '' and eDate != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)], disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)], disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if sDate != '' and eDate != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)], disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)], disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if title != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(title__icontains=str(title), disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, title__icontains=str(title), disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if level_0 != '' and level_1 != '' and level_2 != '' and level_3 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_2, fk_category_level3=level_3, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_2, fk_category_level3=level_3, title__icontains=title, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if level_0 != '' and level_1 != '' and level_2 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_2, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_2, title__icontains=title, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if level_0 != '' and level_1 != '' and level_3 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_3, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level1=level_1, fk_category_level2=level_3, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if level_0 != '' and level_2 != '' and level_3 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, fk_category_level2=level_2, fk_category_level3=level_3, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level2=level_2, fk_category_level3=level_3, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if level_1 != '' and level_2 != '' and level_3 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level1=level_1, fk_category_level2=level_2, fk_category_level3=level_3, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level1=level_1, fk_category_level2=level_2, fk_category_level3=level_3, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if level_0 != '' and level_1 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, fk_category_level1=level_1, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level1=level_1, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if level_0 != '' and level_2 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, fk_category_level2=level_2, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level2=level_2, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if level_0 != '' and level_3 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, fk_category_level3=level_3, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, fk_category_level3=level_3, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if level_1 != '' and level_2 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level1=level_1, fk_category_level2=level_2, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level1=level_1, fk_category_level2=level_2, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if level_1 != '' and level_3 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level1=level_1, fk_category_level3=level_3, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level1=level_1, fk_category_level3=level_3, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if level_2 != '' and level_3 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level2=level_2, fk_category_level3=level_3, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level2=level_2, fk_category_level3=level_3, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if level_0 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level0=level_0, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level0=level_0, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if level_1 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level1=level_1, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level1=level_1, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if level_2 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level2=level_2, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level2=level_2, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        if level_3 != '':
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item = Item.objects.filter(fk_category_level3=level_3, disabled_item_status=1).all()
                serializer_class = ItemSerializer(item, many=True)
                return Response(serializer_class.data, status=200)
            item = Item.objects.filter(fk_user_idx=user.idx, fk_category_level3=level_3, disabled_item_status=1).all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)
        return Response(status=203)

class ItemApi(generics.ListCreateAPIView):
    def __init__(self):
        print("ItemApi INIT")

    def get(self, request):
        self.mode = request.GET.get("mode")
        if self.mode != '' and self.mode == 'trash':
            self.boshow_token = request.GET.get("boshow_token")
            user_idx = getUserInfo(self.boshow_token)["idx"]
            item=Item.objects.filter(disabled_item_status=1, fk_user_idx=user_idx).order_by('-idx').all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)
        self.boshow_token = request.GET.get("boshow_token")
        self.title = request.GET.get("title")
        self.idx = request.GET.getlist("itemIdx[]")

        if self.boshow_token is not None:
            user_idx = getUserInfo(self.boshow_token)["idx"]

            # user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            # if user.tier == 0 or user.tier == 3:
            #     item = Item.objects.order_by('-idx').all()
            #     if self.title is not None and len(self.title) > 0:
            #         item = item.filter(title=self.title).all()
            #     serializer_class = ItemSerializer(item, many=True)
            #     return Response(serializer_class.data)

            item = Item.objects.filter(fk_user_idx=user_idx, disabled_item_status=1).order_by('-idx').all()

            if self.title is not None and len(self.title) > 0:
                item = item.filter(title=self.title).all()

            serializer_class = ItemSerializer(item, many=True)

            return Response(serializer_class.data)

        elif self.idx is not None and self.idx != []:
            item=Item.objects.filter(disabled_item_status=1, idx__in=self.idx).order_by('-idx').all()
            serializer_class = ItemSerializer(item, many=True)
            return Response(serializer_class.data, status=200)

        else:
            item=Item.objects.filter(disabled_item_status=1).order_by('-idx').all()
            if self.title is not None and len(self.title) > 0:
                item = item.filter(title=self.title).all()

            serializer_class = ItemSerializer(item, many=True)
            
            return Response(serializer_class.data)

    def post(self, request):
        self.files = request.FILES.getlist('files')
        self.title = request.POST['title']
        self.description = request.POST['description']
        self.price = request.POST['price']
        self.url = request.POST['url']
        self.boshow_token = request.POST['boshow_token']
        self.tag = request.POST['tag']

        user_idx = getUserInfo(self.boshow_token)["idx"]

        # 카테고리
        self.level_0 = request.POST['level_0']
        self.level_1 = request.POST['level_1']
        self.level_2 = request.POST['level_2']
        self.level_3 = request.POST['level_3']
        print(self.level_3)

        new_item = Item(
            title = self.title,
            description = self.description,
            fk_user_idx = user_idx,
            price = self.price,
            url = self.url,
            fk_category_level0 = int(self.level_0),
            fk_category_level1 = int(self.level_1),
            fk_category_level2 = int(self.level_2),
            fk_category_level3 = int(self.level_3),
            upload_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            ai_connection = 0,
            disabled_item_status = 1
        )
        new_item.save()
        
        if self.tag and self.tag != '':
            tags = self.tag.split(',')
            for tag in tags:
                new_item_tag = ItemTag(
                    fk_item_idx = Item.objects.get(idx=new_item.idx),
                    tag = tag
                )
                new_item_tag.save()

        item_image_path = ITEM_IMAGE_DIR + str(new_item.idx)

        if os.path.exists(item_image_path):
            shutil.rmtree(item_image_path, ignore_errors=True)
            os.mkdir(item_image_path)

        i = 0
        for file in self.files:
            i += 1
            default_storage.save(item_image_path + '/item_' + str(i) + ".jpg", ContentFile(file.read()))
        
        return Response(True)

    def delete(self, request):
        self.idx = request.GET.get("item_idx")

        delete_item = Item.objects.get(idx=self.idx)
        delete_item.disabled_item_status = 0
        delete_item.save()
        
        return Response(True)

    def put(self, request):
        mode = request.GET.get("mode")
        if mode != '' and mode == 'recovery':
            user_idx = request.GET.get('user_idx')
            recovery_item = request.GET.getlist('Sitem[]')
            for i in recovery_item:
                recovery = json.loads(i)
                itemList = Item.objects.get(fk_user_idx=user_idx, idx=recovery['idx'])
                itemList.disabled_item_status = 1
                itemList.save()
            return Response(True)

        self.files = request.FILES.getlist('files')
        self.item_idx = request.POST['item_idx']
        self.title = request.POST['title']
        self.description = request.POST['description']
        self.price = request.POST['price']
        self.url = request.POST['url']
        self.tag = request.POST['tag']

        self.level_0 = True
        try:
            self.level_0 = request.POST['level_0']
            self.level_1 = request.POST['level_1']
            self.level_2 = request.POST['level_2']
            self.level_3 = request.POST['level_3']
        except:
            self.level_0 = False

        update_item = Item.objects.get(idx=self.item_idx)
        if update_item is None:
            # 상품이 존재하지 않음
            return Response(False)

        title_check = Item.objects.get(title=self.title)
        if title_check is not None:
            if title_check.idx != int(self.item_idx):
                # 이름이 중복됨
                return Response("title")

        update_item.title = self.title
        update_item.description = self.description
        update_item.price = self.price
        update_item.url = self.url

        if self.level_0:
            update_item.fk_category_level0 = int(self.level_0)
            update_item.fk_category_level1 = int(self.level_1)
            update_item.fk_category_level2 = int(self.level_2)
            update_item.fk_category_level3 = int(self.level_3)

        update_item.save()

        item_image_path = ITEM_IMAGE_DIR + str(update_item.idx)

        if self.tag and self.tag != '':
            item_tag = ItemTag.objects.filter(fk_item_idx=self.item_idx).all()
            item_tag.delete()

            tags = self.tag.split(',')
            for tag in tags:
                new_item_tag = ItemTag(
                    fk_item_idx = update_item,
                    tag = tag
                )
                new_item_tag.save()

        if len(self.files) != 0:
            if os.path.exists(item_image_path + "/" + "item_1.jpg"):
                os.remove(item_image_path + "/" + "item_1.jpg")
                for file in self.files:
                    default_storage.save(item_image_path + "/" + "item_1.jpg", ContentFile(file.read()))
            else:
                for file in self.files:
                    default_storage.save(item_image_path + "/" + "item_1.jpg", ContentFile(file.read()))

        return Response(True)

class ItemTagApi(generics.ListCreateAPIView):
    def __init__(self):
        print("ItemTagApi INIT")

    def get(self, request):
        item_idx = request.GET.get('item_idx')

        item_tag = ItemTag.objects.all()

        if item_idx is not None and item_idx != '':
            item_tag = item_tag.filter(fk_item_idx=item_idx).all()

        serializer_class = ItemTagSerializer(item_tag, many=True)

        return Response(serializer_class.data)

class ItemCategoryApi(generics.ListCreateAPIView):
    def __init__(self):
        print("ItemCategoryApi INIT")

    def get(self, request):
        self.mode = request.GET.get("mode")
        self.boshow_token = request.GET.get("boshow_token")
        if self.mode != '' and self.mode == 'cate':
            user_idx = getUserInfo(self.boshow_token)["idx"]
            user = User.objects.filter(idx=user_idx, disabled_user_status=1).first()
            if user.tier == 0 or user.tier == 3:
                item=Itemcategory.objects.all()
                serializer_class = ItemCategorySerializer(item, many=True)
                return Response(serializer_class.data)
            item=Itemcategory.objects.filter(fk_user_idx=user.idx).all()
            serializer_class = ItemCategorySerializer(item, many=True)
            return Response(serializer_class.data)
        # self.title = request.GET.get("title")

        if self.boshow_token is not None:
            user_idx = getUserInfo(self.boshow_token)["idx"]

            item = Itemcategory.objects.filter(fk_user_idx=user_idx).all()

            serializer_class = ItemCategorySerializer(item, many=True)
            return Response(serializer_class.data)
        else:
            item = Itemcategory.objects.all()

            serializer_class = ItemCategorySerializer(item, many=True)
            return Response(serializer_class.data)

    def delete(self, request):
        self.boshow_token = request.GET.get("boshow_token")
        self.idx = request.GET.get("idx")

        if self.boshow_token is not None:
            user_idx = getUserInfo(self.boshow_token)["idx"]

            deleted_category = Itemcategory.objects.filter(fk_user_idx=user_idx, idx=self.idx).first()

            deleted_category.delete()
            return Response(True)
        else:
            return Response(status=500)

    def post(self, request):
        self.boshow_token = request.GET.get("boshow_token")
        self.idx = request.GET.get("idx")
        self.name = request.GET.get("name")

        if self.boshow_token is not None:
            user_idx = getUserInfo(self.boshow_token)["idx"]
            user = User.objects.filter(idx=user_idx).first()
            print(self.idx)
            if self.idx != 0 and self.idx != '0':
                parent_category = Itemcategory.objects.filter(fk_user_idx=user_idx, idx=self.idx).first()
                print(parent_category)
                new_category = Itemcategory(
                    fk_user_idx = user,
                    name = self.name,
                    parent = parent_category,
                    level= int(parent_category.level) + 1,
                )
                new_category.save()
            else:
                new_category = Itemcategory(
                    fk_user_idx = user,
                    name = self.name,
                    level = 0,
                )
                new_category.save()

            return Response(True)
    
    def put(self, request):
        self.boshow_token = request.GET.get("boshow_token")
        self.idx = request.GET.get("idx")
        self.name = request.GET.get("name")
        if self.idx != '':
            user_idx = getUserInfo(self.boshow_token)["idx"]
            
            update_category = Itemcategory.objects.filter(fk_user_idx=user_idx, idx=self.idx).first()
            update_category.name = self.name
            update_category.save()

        return Response(True)

class AI_MODEL:
    def __init__(self, img_size=640, ai_connection=0):
        sys.path.insert(0, './tb/ai')

        self.device = select_device('')
        self.half = self.device.type != 'cpu'
        
        # detection
        if ai_connection == 0:
            self.detect_model = MODEL_DIR + 'detect.pt'

            self.detect_model = attempt_load(self.detect_model, map_location=self.device)
            if self.half:
                self.detect_model.half()
            self.img_size = check_img_size(img_size, s=self.detect_model.stride.max())
            self.names = self.detect_model.module.names if hasattr(self.detect_model, 'module') else self.detect_model.names
            self.colors = [[random.randint(0, 255) for _ in range(3)] for _ in self.names]
            self.items = {'top': [], 'bottom': [], 'skirt': [], 'shoes': [], 'cap': [], 'golfball': [], 'golfbag': [], 'golfclub': [], 'mask': [], 'dress': [], 'coat': [], 'watch': []}

        # classification
        self.labels = Label.objects.all()
        self.num_labels = len(self.labels)

        self.classify_model = MODEL_DIR + 'classify.pth'

        self.netD = _netD_result(1, self.num_labels)
        self.netD.load_state_dict(torch.load(self.classify_model, map_location=torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')))

    def detect(self, image, position):
        ori_img = image.copy()
        height, width, channels = image.shape
        h = 1080 / height
        w = 1920 / width

        img = image.copy()
        img = letterbox(img, new_shape=self.img_size)[0]
        img = img[:, :, ::-1].transpose(2, 0, 1)
        img = np.ascontiguousarray(img)
        img = torch.from_numpy(img).to(self.device)
        img = img.half() if self.half else img.float()
        img /= 255.0
        if img.ndimension() == 3:
            img = img.unsqueeze(0)

        pred = self.detect_model(img, augment='')[0]
        pred = non_max_suppression(pred)

        boxes = []
        for i, det in enumerate(pred):
            if len(det):
                det[:, :4] = scale_coords(img.shape[2:], det[:, :4], image.shape).round()

                for *xyxy, conf, cls in reversed(det):
                    label = f'{self.names[int(cls)]} {conf:.2f}'
                    self.items, c1, c2 = plot_one_box(xyxy, image, label=label, color=self.colors[int(cls)], line_thickness=3,
                                         items=self.items, frame=position, ori_img=ori_img)
                    boxes.append({
                        "item_type": int(cls),
                        "x": c1[0] * w,
                        "y": c1[1] * h,
                        "width": (c2[0] - c1[0]) * w,
                        "height": (c2[1] - c1[1]) * h
                    })
        return image, boxes

    def classify(self ,image, x=0, y=0, width=None, height=None):
        image = Image.open(image).convert('RGB')
        
        self.netD.eval()
        self.netD.zero_grad()

        image_width, image_height = image.size

        if width is None:
            width = image_width
            height = image_height
        x1 = int(int(x)/(1920/image_width))
        y1 = int(int(y)/(1080/image_height))
        x2 = int(x1+(int(width)/(1920/image_width)))
        y2 = int(y1+(int(height)/(1080/image_height)))
        w = int(int(width)/(1920/image_width))
        h = int(int(height)/(1080/image_height))

        item_image = image.crop([x1, y1, x2, y2])
        item_image = item_image.resize((w, h), Image.ANTIALIAS)
        item_image = loader(item_image).float()
        item_image = item_image.unsqueeze(0)
        item_image = np.array(item_image)

        item_image = torch.from_numpy(item_image)
        dis, aux = self.netD(item_image)
        pred = torch.argmax(aux.data, 1)

        return pred[0].item()

class ProgressProcess(generics.ListCreateAPIView):
    def __init__(self):
        print("ProgressProcess INIT")
    
    def get(self, request):
        self.fk_video_idx = request.GET.get("fk_video_idx")
        progress_process = ProcessAi.objects.filter(fk_video_idx=self.fk_video_idx)
        serializer_class = ProcessSerializer(progress_process, many=True)

        return Response(serializer_class.data, status=200)

    def put(self, request):
        video_idx = request.GET.get('video_idx')

        progress = ProcessAi.objects.filter(fk_video_idx=video_idx).first()
        if progress is not None:
            progress.ai_status = 0
            progress.save()

        return Response(True)

class Item_Detail(generics.ListCreateAPIView):
    def __init__(self):
        print("ItemDetail INIT")

    def get(self, request):
        video_idx = request.GET.get('video_idx')
        if video_idx != '':
            item_detail = ItemDetail.objects.filter(fk_video_idx=video_idx).exclude(fk_item_idx__isnull=True).all()
            serializer_class = ItemDetailSerializer(item_detail, many=True)
            return Response(serializer_class.data, status=200)
        video_id = request.GET.get('video_id')
        video_list = Video.objects.filter(url__endswith=video_id).first()
        video_idx = video_list.idx

        item_detail = ItemDetail.objects.filter(fk_video_idx=video_idx).all()
        serializer_class = ItemDetailSerializer(item_detail, many=True)

        return Response(serializer_class.data, status=200)

    def post(self, request):
        self.video_idx = request.GET.get('video_idx')
        self.item_idx = request.GET.getlist('item_idx[]')

        self.video = Video.objects.get(idx=self.video_idx)

        # progress 데이터 생성 및 수정/삭제
        self.progress = ProcessAi.objects.filter(fk_video_idx=self.video_idx).first()
        self.init_process(ai_status=1)
        
        video_image_path = MAKE_IMAGE_DIR + str(self.video_idx) + '/'
        image_dir = video_image_path + 'images'  # 영상 캡쳐 이미지
        draw_image_dir = video_image_path + 'draw_images'  # rect 그려진 이미지

        images_file_path = image_dir + '/'
        draw_images_file_path = draw_image_dir + '/'

        ai_connection = self.video.ai_connection
        ai = AI_MODEL(ai_connection=ai_connection)

        # detection
        if ai_connection == 0:
            if os.path.exists(video_image_path): shutil.rmtree(video_image_path, ignore_errors=True)
            os.makedirs(image_dir)
            os.mkdir(draw_image_dir)
            
            # # 영상 캡쳐
            platform = self.video.platform
            if platform == 'SBS':
                url = self.getSbsVideo()
            elif platform == '직접 업로드':
                url = VIDEO_DIR + str(self.video.idx) + '.' + self.video.url
            elif platform == 'YOUTUBE':
                vPafy = pafy.new(self.video.url)
                url = vPafy.getbest(preftype="mp4").url
            cap = cv2.VideoCapture(url)
            retval, image = cap.read()

            total_frame = int(cap.get(7))
            start_time = time.time()
            position = 1
            while (retval):
                image_name = str(position).zfill(5)
                image_path = images_file_path + image_name + '.jpg'
                
                cv2.imwrite(image_path, image)
                process_num = (position / total_frame) * 100
                image, boxes = ai.detect(image, position)
                draw_image_path = draw_images_file_path + '/' + image_name + '.jpg'
                cv2.imwrite(draw_image_path, image)

                if len(boxes):
                    for box in boxes:
                        current_time = cap.get(cv2.CAP_PROP_POS_MSEC) / 1000
                        self.add_item_detail(position, current_time, box)
                stop = self.update_process(image_name, process_num)
                if stop:
                    break
                position += 1
                retval, image = cap.read()

            if stop:
                item_detail = ItemDetail.objects.filter(fk_video_idx=self.video.idx).all()
                item_detail.delete()
                return Response(False)

            elapsed_time = time.time() - start_time
            print('detection Time:', elapsed_time)
            cap.release()
            cv2.destroyAllWindows()

            video = Video.objects.filter(idx=self.video_idx).first()
            video.ai_connection = 1
            video.save()

        self.init_process(ai_status=2)

        # classification
        item_detail = ItemDetail.objects.filter(fk_video_idx=self.video.idx).all()
        detail_length = len(item_detail)

        item_label_all = []

        for item_idx in self.item_idx:
            item_images = glob.glob(ITEM_IMAGE_DIR + str(item_idx) + "/*.jpg")
            item_labels = []

            print(item_images)
            for item_image in item_images:
                item_labels.append(ai.classify(item_image))
            
            print(item_labels)
            # 추후 3개중 많이 나온 상품으로 넣도록 변경 필요
            item_label_all.append(item_labels[0])

        for i in range(detail_length):
            self.detail = item_detail[i]
            image_name = str(self.detail.position).zfill(5)
            image = images_file_path + image_name + ".jpg"
            
            process_num = (i + 1) / detail_length * 100
            if os.path.isfile(image):
                fk_label_idx = ai.classify(image, self.detail.x, self.detail.y, self.detail.width, self.detail.height)
                try:
                    fk_item_idx = self.item_idx[item_label_all.index(fk_label_idx)]
                except:
                    fk_item_idx = None
                self.add_item_label(fk_item_idx, fk_label_idx)

            stop = self.update_process(image_name, process_num)
            if stop:
                break

        if stop:
            return Response(False)
        
        self.init_process(ai_status=3)
        
        serializer_class = ItemDetailSerializer(item_detail, many=True)

        return Response(serializer_class.data)

    def init_process(self, ai_status=0):
        if self.progress is not None:
            self.progress.progress = 0
            self.progress.draw_img_name = 0
            self.progress.ai_status = ai_status
        else:
            self.progress = ProcessAi(
                fk_video_idx = self.video,
                # fk_video_idx = Video.objects.get(idx=self.video_idx),
                progress = 0,
                draw_img_name = 0,
                ai_status = ai_status,
            )

        self.progress.save()

    def update_process(self, draw_img, progress_num):
        progress = ProcessAi.objects.get(fk_video_idx=self.video_idx)
        if progress is not None:
            # progress.fk_video_idx = Video.objects.get(idx=self.video_idx),
            progress.progress = int(progress_num)
            progress.draw_img_name = draw_img
            progress.save()
        
            if int(progress.ai_status) == 0:
                return True
            
            return False

    def getSbsVideo(self):
        url = VIDEO_DIR + str(self.video.idx) + '.mp4'
        r = requests.get(self.video.url, stream=True)

        with open(url, 'wb') as f:
            for chunk in r.iter_content(chunk_size=1024 * 1024):
                if chunk:
                    f.write(chunk)
        
        return url

    def add_item_detail(self, position, current_time, box):
        new_detail = ItemDetail(
            # fk_video_idx = self.video,
            fk_video_idx = self.video.idx,
            position = position,
            position_time = current_time,
            x = box['x'],
            y = box['y'],
            width = box['width'],
            height = box['height'],
            category = box['item_type']
        )
        new_detail.save()
    
    def add_item_label(self, fk_item_idx, fk_label_idx):
        if fk_item_idx is not None:
            self.detail.fk_item_idx = fk_item_idx
        self.detail.fk_label_idx = fk_label_idx
        self.detail.save()

    def put(self, request):
        idx = request.GET.get("idx")
        x = request.GET.get("x")
        y = request.GET.get("y")
        width = request.GET.get("width")
        height = request.GET.get("height")
        delete_item_idx = request.GET.getlist("delete_item_idx[]")

        if delete_item_idx is not None:
            for item_idx in delete_item_idx:
                item_detail = ItemDetail.objects.filter(fk_item_idx=item_idx).all()
                for item in item_detail:
                    item.fk_item_idx = None
                    item.save()
        else:
            item_detail = ItemDetail.objects.get(idx=idx)
            if item_detail is not None:
                item_detail.x = x
                item_detail.y = y
                item_detail.width = width
                item_detail.height = height
                item_detail.save()

        return Response(True)

class BoshowPlayer(generics.ListCreateAPIView):
    def __init__(self):
        print("Player INIT")

    def post(self, request):
        request.encoding = 'utf-8'
        print("[Player START...]")
        self.mediaurl = request.GET.get("mediaurl")
        print(self.mediaurl)

        if (Video.objects.get(url=self.mediaurl[:69])):
            print("성공")
            return Response(status=200)
        else:
            print("실패")
            return Response(status=500)

class MakeSbsToken(generics.ListCreateAPIView):
    def get(self, request):
        HMAC_Key = "782F413F4428472B4B6250655367566B5970337336763979244226452948404D"
        token = jwt.encode({'timestamp' : time.time()}, HMAC_Key, algorithm = "HS256")
        return Response({"token" : token }, status=200)

class AdbMatchVideoApi(generics.ListCreateAPIView):
    def __init__(self):
        print("AdbMacthVideoApi INIT")

    def get(self, request):
        fk_video_idx = request.GET.get("fk_video_idx")

        if fk_video_idx is not None:
            adb = AdbMatching.objects.filter(fk_video_idx=fk_video_idx).all()
            serializer_class = AdbMatchingSerializer(adb, many=True)
            return Response(serializer_class.data, status=200)
        else:
            adb = AdbMatching.objects.all()
            serializer_class = AdbMatchingSerializer(adb, many=True)
            return Response(serializer_class.data, status=200)
        

    def post(self, request):
        selectCount = ''
        adbList = request.GET.getlist('adb[]')
        video_idx = request.GET.get('video_idx')
        for i in adbList:
            adb = json.loads(i)
            prev_adb = AdbMatching.objects.filter(fk_video_idx=video_idx, adb_type=adb["type"]).first()
            if prev_adb is not None:
                print(prev_adb.adb_type, prev_adb.fk_adb_idx)
                prev_adb = AdbMatching.objects.get(fk_video_idx=video_idx, adb_type=adb["type"])
                prev_adb.fk_adb_idx = Adb.objects.filter(idx=adb['idx']).first()
                prev_adb.use_start_date = adb['sDate']
                prev_adb.use_end_date = adb['eDate']
                prev_adb.expo_count = adb['selectCount']
                prev_adb.adb_type = adb['type']
                prev_adb.save()
            else:
                new_adb = AdbMatching(
                    use_start_date = adb['sDate'],
                    use_end_date = adb['eDate'],
                    expo_count = adb['selectCount'],
                    adb_type = adb['type'],
                )
                new_adb.fk_video_idx = Video.objects.filter(idx=video_idx).first()
                new_adb.fk_adb_idx = Adb.objects.filter(idx=adb['idx']).first()
                new_adb.save()
        return Response(status=200)

class AdbSearchApi(generics.ListCreateAPIView):
    def __init__(self):
        print("AdbSearchApi INIT")

    def post(self, request):
        mode = request.GET.get('mode')
        title = request.GET.get('searchTitle')
        print(mode, title)
        if mode != '' and mode == "operAdbTitle":
            adb = Adb.objects.filter(name__icontains=str(title)).all()
            serializer_class = AdbSerializer(adb, many=True)
            return Response(serializer_class.data, status=200)
        if mode != '' and mode == "operAdbType":
            type = request.GET.get('type')
            print(type)
            adb = Adb.objects.filter(type=int(type)).filter(name__icontains=str(title)).all()
            serializer_class = AdbSerializer(adb, many=True)
            return Response(serializer_class.data, status=200)

        type = request.GET.get('searchtype')
        sDate = request.GET.get('searchStartDate')
        eDate = request.GET.get('searchEndDate')
        adder = request.GET.get('searchadder')
        print(sDate, eDate)
        
        if type != '' and sDate != '' and eDate != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            adb = Adb.objects.filter(type=int(type)).filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = AdbSerializer(adb, many=True)
            return Response(serializer_class.data, status=200)
        
        if sDate != '' and eDate != '':
            end = eDate.split('-')
            end = datetimedelta.date(int(end[0]), int(end[1]), int(end[2]))
            adb = Adb.objects.filter(upload_time__range=[sDate, end+datetimedelta.timedelta(days=1)]).all()
            serializer_class = AdbSerializer(adb, many=True)
            return Response(serializer_class.data, status=200)

        if type != '':
            adb = Adb.objects.filter(type=int(type)).all()
            serializer_class = AdbSerializer(adb, many=True)
            return Response(serializer_class.data, status=200)
        return Response(status=203)

class AdbApi(generics.ListCreateAPIView):
    def __init__(self):
        print("AdbApi INIT")

    def get(self, request):
        typeList = {'A': 0, 'B': 1, 'C': 2, 'D': 3}
        type = request.GET.get('type')
        category_idx = request.GET.get("category_idx")
        adbArr = request.GET.getlist('adbIdx[]')

        if category_idx is not None:
            items = Item.objects.filter(disabled_item_status=1, fk_category_idx=category_idx).all()

            for item in items:
                print(item)
            items_idx = []

            Response(True)

        if type is not None: 
            adb = Adb.objects.filter(type=typeList[type]).order_by('-idx').all()
            serializer_class = AdbSerializer(adb, many=True)
            return Response(serializer_class.data, status=200)

        if adbArr is not None and adbArr != []:
            print(adbArr)
            adb = Adb.objects.filter(idx__in=adbArr).order_by('-idx').all()
            serializer_class = AdbSerializer(adb, many=True)
            return Response(serializer_class.data, status=200)

        adb = Adb.objects.order_by('-idx').all()
        serializer_class = AdbSerializer(adb, many=True)
 
        return Response(serializer_class.data, status=200)

    def post(self, request):
        self.files = request.FILES.getlist('file')
        self.type = request.POST['type']
        self.name = request.POST['name']
        self.brand = request.POST['brand']
        self.adb_agency = request.POST['adb_agency']
        # self.image_url = request.POST['image_url']
        self.description = request.POST['description']
        self.tags = request.POST['tag']
        self.url = request.POST['url']
        
        new_adb = Adb(
        fk_item_idx = 0,
        type = self.type,
        status = 0,
        name = self.name,
        brand = self.brand,
        adb_agency = self.adb_agency,
        description = self.description,
        url = self.url,
        upload_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

        new_adb.save()

        for file in self.files:
            default_storage.save(ADB_IMAGE_DIR + str(new_adb.idx) + ".jpg", ContentFile(file.read()))

        if self.tags and self.tags != '':
            print('태그')
            tags = self.tags.split(',')
            for i in range(0, len(tags)):
                new_adb_tag = AdbTag(
                    fk_adb_idx = new_adb,
                    tag = tags[i]
                )
                new_adb_tag.save()
        # img_name = str(item[0].idx) + "_" + str(self.name) + ".jpg"
        # cv2.imwrite(os.path.join(ADBERTISE_IMAGES_DIR , img_name), self.image)
        
        return Response(status=200)

    def put(self, request):
        self.files = request.FILES.getlist('file')
        self.idx = request.POST["update_idx"]
        self.name = request.POST["update_name"]
        self.type = request.POST["update_type"]
        self.adb_agency = request.POST["update_agency"]
        if len(self.files) != 0:    
            update_adb = Adb.objects.get(idx=self.idx)
            if update_adb is not None:
                update_adb.name = self.name
                update_adb.type = self.type
                update_adb.adb_agency = self.adb_agency
                update_adb.save()
            if os.path.exists(ADB_IMAGE_DIR + str(self.idx) + ".jpg"):
                os.remove(ADB_IMAGE_DIR + str(self.idx) + ".jpg")
                for file in self.files:
                    default_storage.save(ADB_IMAGE_DIR + str(self.idx) + ".jpg", ContentFile(file.read()))
            else:
                for file in self.files:
                    default_storage.save(ADB_IMAGE_DIR + str(self.idx) + ".jpg", ContentFile(file.read()))
            return Response(True)
        else:    
            update_adb = Adb.objects.get(idx=self.idx)
            if update_adb is not None:
                update_adb.name = self.name
                update_adb.type = self.type
                update_adb.adb_agency = self.adb_agency
                update_adb.save()
            return Response(True)

class GetAdbItems(generics.ListCreateAPIView):
    def __init__(self):
        print("GetAdbItems")

    def get(self, request):
        if request.GET.get("isSpecial"):

            specialResult = Adb.objects.filter(type=4).first()
            ad = AdbSerializer(specialResult, many=False)

            return Response(ad.data, status=200)

        itemArr = request.GET.getlist('itemIdx[]')
        print(itemArr)
        adb = Adb.objects.filter(fk_item_idx__in=itemArr).all()
        # serializer_class = AdbSerializer(adb, many=True)
        # return Response(serializer_class.data, status=200)

        # AdbList
        a = []
        b = []
        c = []
        d = []

        for ad in adb:
            if ad.type == 0: # a
                a.append(ad)
            elif ad.type == 1: # b
                b.append(ad)
            elif ad.type == 2: # c
                c.append(ad)
            else : #d
                d.append(ad)

        # a는 있으나 없으나.
        # c는 1개이상 이면 같은 비디오 에서 5개를 추가로 불러옴
        # b는 c가 있으면 무조건 하나는 있어야함.
        # d는 c와같음.

        try:
            if len(c) > 0 and len(b) < 1:
                bresult = Adb.objects.filter(type=1).first()
                if len(bresult):
                    for ad in bresult:
                        b.append(ad)
        except:
            ...

        try:
            if len(c) > 0 or len(c) < 5:
                cresult = Adb.objects.filter(type=2).exclude(fk_item_idx__in=itemArr)[:5]
                if len(cresult):
                    for ad in cresult:
                        c.append(ad)
        except:
            ...

        try:
            if len(d) > 0 or len(d) < 5:
                dresult = Adb.objects.filter(type=3).exclude(fk_item_idx__in=itemArr)[:5]
                if len(dresult):
                    for ad in dresult:
                        d.append(ad)
        except:
            ...

        jsonObject = {}
        type = 0
        types = ['a', 'b', 'c', 'd']
        for dbs in [a, b, c, d]:
            ad = AdbSerializer(list(dbs), many=True)
            jsonObject[types[type]] = ad.data
            type += 1
	
        return Response(json.dumps(jsonObject), status=200)

class InputImage:
    def imwrite(self, name, file, params):
        try:
            ext = os.path.splitext(name)[1]
            result, n = cv2.imencode(ext, file, params)
            if result:
                with open(name, mode='w+b') as f:
                    n.tofile(f)
                    return True
            else:
                return False
        except Exception as e:
            print(e)
            return False

class FileUploadApi(generics.ListCreateAPIView):
    def __init__(self):
        print("FileUploadApi init")

    def post(self, request):
        file_len = request.POST['file_len']
        image1 = request.data.getlist('files')
        for i in range(0, int(file_len)):
            image = request.data.getlist('files_'+str(i))
            for obj in image:
                path = default_storage.save("test_"+str(i)+".png", ContentFile(obj.read()))
        return Response(status=200)
        
class YoutubeSearchApi(generics.ListCreateAPIView):
    def __init__(self):
        print("YoutubeSearchApi init")

    def post(self, request):
        searchMode = request.GET.get('searchMode')

        if searchMode == "link":
            youtube_link = request.GET.get('youtube_link')
            vPafy = pafy.new("https://www.youtube.com/watch?v="+str(youtube_link))
            url = vPafy.getbest(preftype="mp4").url

            cap = cv2.VideoCapture(url)
            fps = cap.get(cv2.CAP_PROP_FPS)
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            duration = frame_count/fps
            return Response(duration)

        elif searchMode == "Ac":
            youtube_title = request.GET.get('youtube_title')
            search = SearchVideos(str(youtube_title), mode="json", max_results=50)
            list = json.loads(search.result())["search_result"]
            return Response(list, status=200)
        return Response()

class modify_password(generics.ListCreateAPIView):
    def __init__(self):
        print("modify_password init")

    def post(self, request):
        tp = request.GET.get('temp_pw')
        np = request.GET.get('new_pw')

        user = User.objects.filter(pw=tp, disabled_user_status=1).first()
        if user is not None:
            new_pw = np.encode('utf-8')
            new_pw_crypt = bcrypt.hashpw(new_pw, bcrypt.gensalt())
            user.pw = new_pw_crypt
            user.save()
            return Response(True)
        return Response()

class CertificateAuth(generics.ListCreateAPIView):
    def __init__(self):
        print("CertificateAuth init")

    def post(self, request):
        mode = request.GET.get('mode')

        if mode == "email":
            email = request.GET.get('email')
            user = User.objects.filter(email=email, disabled_user_status=1).first()
            if user is not None:
                return Response({"result": True})
            return Response({"result": False})
        elif mode == "id":
            user_id = request.GET.get('user_id')
            user = User.objects.filter(id=user_id, disabled_user_status=1).first()
            if user is not None:
                return Response({"result": True})
            return Response({"result": False})
        elif mode == "pw":
            name = request.GET.get('name')
            id = request.GET.get('id')
            email = request.GET.get('email')
            if User.objects.filter(name=name, disabled_user_status=1).first() is None:
                return Response({"result": False, "type": "name"})
            if User.objects.filter(id=id, disabled_user_status=1).first() is None:
                return Response({"result": False, "type": "id"})
            if User.objects.filter(email=email, disabled_user_status=1).first() is None:
                return Response({"result": False, "type": "email"})
            return Response({"result": True})

class EmailCertification(generics.ListCreateAPIView):
    def __init__(self):
        print("EmailCertification init")

    def idSending(self, email, name, id):
        email = EmailMessage('아이디 찾기', "이름: "+str(name)+", 아이디: "+str(id), to=[str(email)])
        email.send()

    def pwSending(self, email, name, id, pw):
        email = EmailMessage('비밀번호 찾기', "이름: "+str(name)+", 아이디: "+str(id)+", 임시 비밀번호: "+str(pw) , to=[str(email)])
        email.send()

    def post(self, request):
        mode = request.GET.get('mode')
        if mode == "id":
            email = request.GET.get('email')
            print(email)
            user = User.objects.filter(email=email, disabled_user_status=1).first()
            self.idSending(email, user.name, user.id)
            return Response(True)
        if mode == "pw":
            name = request.GET.get('name')
            id = request.GET.get('id')
            email = request.GET.get('email')
            user = User.objects.filter(name=name, id=id, email=email, disabled_user_status=1).first()
            random_pw = string.ascii_lowercase + string.digits
            temp_pw = ""
            for i in range(_LENGTH):
                temp_pw += random.choice(random_pw)
            self.pwSending(email, name, id, temp_pw)
            user.pw = str(temp_pw)
            user.save()
            return Response(True)
        return Response()