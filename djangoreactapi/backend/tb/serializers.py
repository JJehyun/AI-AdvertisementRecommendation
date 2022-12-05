#backend/post/serializers.py
from rest_framework import serializers
from .models import Itemcategory, User
from .models import Userconnection
from .models import Notice
from .models import QnA
from .models import Faq
from .models import Video
from .models import VideoTag
from .models import Item
from .models import ItemTag
from .models import ProcessAi
from .models import ItemDetail
from .models import Adb
from .models import AdbMatching

class UserFAQSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField()
    class Meta:
        fields = ('idx', 'type', 'user_name', 'title', 'contents', 'upload_time', 'views')
        model = Faq

class UserQnASerializer(serializers.ModelSerializer):
    user_name = serializers.CharField()
    class Meta:
        fields = ('idx', 'fk_user_idx', 'user_name', 'type', 'title', 'contents', 'answer', 'answered_name', 'status', 'upload_time', 'answered_time')
        model = QnA

class UserNoticeSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField()
    class Meta:
        fields = ('idx', 'fk_user_idx', 'user_name', 'title', 'contents', 'upload_time', 'views')
        model = Notice

class UserLogSerializer(serializers.ModelSerializer):
    user_id = serializers.CharField()
    user_name = serializers.CharField()
    user_tier = serializers.CharField()
    user_dept = serializers.CharField()
    user_disabled = serializers.CharField()
    class Meta:
        fields = ('idx', 'fk_user_idx', 'user_id', 'user_name', 'user_tier', 'user_dept', 'user_disabled', 'login_time', 'logout_time')
        model = Userconnection

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = User
        
class VideoSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField()
    user_tier = serializers.CharField()

    class Meta:
        fields = ('idx', 'fk_user_idx', 'user_name', 'user_tier', 'title', 'description', 'duration', 'url', 'thumbnail', 'category', 'platform', 'view', 'upload_time', 'ai_connection', 'transmission_status', 'total_frame')
        model = Video

class VideoTagSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = VideoTag

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = Item

class ItemTagSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = ItemTag

class ItemCategorySerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = Itemcategory

class ProcessSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = ProcessAi

class ItemDetailSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = ItemDetail

class AdbSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = Adb

class AdbMatchingSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = AdbMatching