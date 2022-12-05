from django.contrib import admin

from .models import User
from .models import Video
from .models import Item
from .models import Adb

admin.site.register(User)
admin.site.register(Video)
admin.site.register(Item)
admin.site.register(Adb)