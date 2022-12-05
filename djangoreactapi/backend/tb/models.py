# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Faq(models.Model):
    idx = models.AutoField(primary_key=True)
    fk_user_idx = models.ForeignKey('User', models.DO_NOTHING, db_column='fk_user_idx')
    type = models.IntegerField()
    title = models.CharField(max_length=256)
    contents = models.TextField()
    upload_time = models.DateTimeField()
    views = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'FAQ'


class QnA(models.Model):
    idx = models.AutoField(primary_key=True)
    fk_user_idx = models.ForeignKey('User', models.DO_NOTHING, db_column='fk_user_idx')
    type = models.IntegerField()
    title = models.CharField(max_length=256)
    contents = models.TextField()
    answer = models.TextField(blank=True, null=True)
    answered_name = models.CharField(max_length=50, blank=True, null=True)
    status = models.IntegerField()
    upload_time = models.DateTimeField()
    answered_time = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'QnA'


class Adb(models.Model):
    idx = models.AutoField(primary_key=True)
    fk_item_idx = models.IntegerField()
    type = models.IntegerField()
    status = models.IntegerField()
    name = models.CharField(max_length=256)
    brand = models.CharField(max_length=256)
    adb_agency = models.CharField(max_length=256)
    description = models.CharField(max_length=256, blank=True, null=True)
    url = models.TextField()
    upload_time = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'adb'


class AdbMatching(models.Model):
    idx = models.AutoField(primary_key=True)
    fk_video_idx = models.ForeignKey('Video', models.DO_NOTHING, db_column='fk_video_idx')
    fk_adb_idx = models.ForeignKey(Adb, models.DO_NOTHING, db_column='fk_adb_idx')
    use_start_date = models.DateTimeField(blank=True, null=True)
    use_end_date = models.DateTimeField(blank=True, null=True)
    expo_count = models.IntegerField(blank=True, null=True)
    adb_type = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'adb_matching'


class AdbTag(models.Model):
    idx = models.AutoField(primary_key=True)
    fk_adb_idx = models.ForeignKey(Adb, models.DO_NOTHING, db_column='fk_adb_idx')
    tag = models.CharField(max_length=256)

    class Meta:
        managed = False
        db_table = 'adb_tag'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Company(models.Model):
    idx = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'company'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class DjangoSite(models.Model):
    domain = models.CharField(unique=True, max_length=100)
    name = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'django_site'


class Item(models.Model):
    idx = models.AutoField(primary_key=True)
    fk_user_idx = models.IntegerField()
    title = models.CharField(max_length=45)
    description = models.CharField(max_length=45, blank=True, null=True)
    price = models.CharField(max_length=45)
    url = models.TextField()
    fk_category_level0 = models.IntegerField()
    fk_category_level1 = models.IntegerField()
    fk_category_level2 = models.IntegerField()
    fk_category_level3 = models.IntegerField()
    upload_time = models.DateTimeField()
    ai_connection = models.PositiveIntegerField()
    disabled_item_status = models.PositiveIntegerField()

    class Meta:
        managed = False
        db_table = 'item'


class Itemcategory(models.Model):
    idx = models.AutoField(primary_key=True)
    fk_user_idx = models.ForeignKey('User', models.DO_NOTHING, db_column='fk_user_idx')
    name = models.CharField(max_length=50)
    parent = models.ForeignKey('self', models.DO_NOTHING, db_column='parent', blank=True, null=True)
    level = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'itemCategory'


class Itemoptions(models.Model):
    idx = models.AutoField(primary_key=True)
    fk_item_idx = models.ForeignKey(Item, models.DO_NOTHING, db_column='fk_item_idx')
    name = models.CharField(max_length=450)
    value = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'itemOptions'


class ItemDetail(models.Model):
    idx = models.AutoField(primary_key=True)
    fk_video_idx = models.IntegerField()
    fk_item_idx = models.IntegerField(blank=True, null=True)
    position = models.PositiveBigIntegerField()
    position_time = models.FloatField()
    x = models.FloatField()
    y = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()
    fk_label_idx = models.IntegerField(blank=True, null=True)
    category = models.CharField(max_length=256)

    class Meta:
        managed = False
        db_table = 'item_detail'


class ItemTag(models.Model):
    idx = models.AutoField(primary_key=True)
    fk_item_idx = models.ForeignKey(Item, models.DO_NOTHING, db_column='fk_item_idx')
    tag = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'item_tag'


class Label(models.Model):
    idx = models.AutoField(primary_key=True)
    name = models.CharField(max_length=256)

    class Meta:
        managed = False
        db_table = 'label'


class Notice(models.Model):
    idx = models.AutoField(primary_key=True)
    fk_user_idx = models.ForeignKey('User', models.DO_NOTHING, db_column='fk_user_idx')
    title = models.CharField(max_length=256)
    contents = models.TextField()
    upload_time = models.DateTimeField()
    views = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'notice'


class ProcessAi(models.Model):
    idx = models.AutoField(primary_key=True)
    fk_video_idx = models.ForeignKey('Video', models.DO_NOTHING, db_column='fk_video_idx', blank=True, null=True)
    progress = models.IntegerField(blank=True, null=True)
    draw_img_name = models.CharField(max_length=256, blank=True, null=True)
    ai_status = models.PositiveIntegerField()

    class Meta:
        managed = False
        db_table = 'process_ai'


class User(models.Model):
    idx = models.AutoField(primary_key=True)
    id = models.CharField(max_length=256)
    email = models.CharField(max_length=256)
    pw = models.CharField(max_length=256)
    name = models.CharField(max_length=50)
    fk_company_idx = models.ForeignKey(Company, models.DO_NOTHING, db_column='fk_company_idx')
    dept = models.CharField(max_length=45, blank=True, null=True)
    phone = models.CharField(max_length=11, blank=True, null=True)
    tier = models.IntegerField()
    status = models.PositiveIntegerField()
    tier_modify_notify = models.PositiveIntegerField()
    admin_notify = models.PositiveIntegerField()
    disabled_user_status = models.PositiveIntegerField()

    class Meta:
        managed = False
        db_table = 'user'


class Userconnection(models.Model):
    idx = models.AutoField(primary_key=True)
    fk_user_idx = models.ForeignKey(User, models.DO_NOTHING, db_column='fk_user_idx')
    login_time = models.DateTimeField()
    logout_time = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'userConnection'


class UserAlarm(models.Model):
    idx = models.IntegerField()
    fk_user_idx = models.IntegerField()
    contents = models.CharField(max_length=1024, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_alarm'


class Video(models.Model):
    idx = models.AutoField(primary_key=True)
    fk_user_idx = models.ForeignKey(User, models.DO_NOTHING, db_column='fk_user_idx')
    title = models.CharField(max_length=256)
    description = models.CharField(max_length=1024, blank=True, null=True)
    duration = models.IntegerField()
    url = models.TextField()
    thumbnail = models.TextField()
    category = models.IntegerField()
    platform = models.CharField(max_length=50)
    view = models.IntegerField()
    upload_time = models.DateTimeField()
    ai_connection = models.IntegerField()
    transmission_status = models.IntegerField()
    disabled_video_status = models.IntegerField()
    total_frame = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'video'


class VideoTag(models.Model):
    idx = models.AutoField(primary_key=True)
    fk_video_idx = models.ForeignKey(Video, models.DO_NOTHING, db_column='fk_video_idx')
    tag = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'video_tag'