# Generated by Django 3.1.7 on 2021-06-25 14:12

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Adb',
            fields=[
                ('idx', models.AutoField(primary_key=True, serialize=False)),
                ('fk_item_idx', models.IntegerField()),
                ('type', models.IntegerField()),
                ('status', models.IntegerField()),
                ('name', models.CharField(max_length=256)),
                ('brand', models.CharField(max_length=256)),
                ('adb_agency', models.CharField(max_length=256)),
                ('description', models.CharField(blank=True, max_length=256, null=True)),
                ('url', models.TextField()),
                ('upload_time', models.DateTimeField()),
            ],
            options={
                'db_table': 'adb',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AdbMatching',
            fields=[
                ('idx', models.AutoField(primary_key=True, serialize=False)),
                ('use_start_date', models.DateTimeField(blank=True, null=True)),
                ('use_end_date', models.DateTimeField(blank=True, null=True)),
                ('expo_count', models.IntegerField(blank=True, null=True)),
                ('adb_type', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'db_table': 'adb_matching',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AdbTag',
            fields=[
                ('idx', models.AutoField(primary_key=True, serialize=False)),
                ('tag', models.CharField(max_length=256)),
            ],
            options={
                'db_table': 'adb_tag',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthGroup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150, unique=True)),
            ],
            options={
                'db_table': 'auth_group',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthGroupPermissions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'db_table': 'auth_group_permissions',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthPermission',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('codename', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'auth_permission',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128)),
                ('last_login', models.DateTimeField(blank=True, null=True)),
                ('is_superuser', models.IntegerField()),
                ('username', models.CharField(max_length=150, unique=True)),
                ('first_name', models.CharField(max_length=150)),
                ('last_name', models.CharField(max_length=150)),
                ('email', models.CharField(max_length=254)),
                ('is_staff', models.IntegerField()),
                ('is_active', models.IntegerField()),
                ('date_joined', models.DateTimeField()),
            ],
            options={
                'db_table': 'auth_user',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthUserGroups',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'db_table': 'auth_user_groups',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthUserUserPermissions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'db_table': 'auth_user_user_permissions',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Company',
            fields=[
                ('idx', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, max_length=50, null=True)),
            ],
            options={
                'db_table': 'company',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoAdminLog',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action_time', models.DateTimeField()),
                ('object_id', models.TextField(blank=True, null=True)),
                ('object_repr', models.CharField(max_length=200)),
                ('action_flag', models.PositiveSmallIntegerField()),
                ('change_message', models.TextField()),
            ],
            options={
                'db_table': 'django_admin_log',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoContentType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('app_label', models.CharField(max_length=100)),
                ('model', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'django_content_type',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoMigrations',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('app', models.CharField(max_length=255)),
                ('name', models.CharField(max_length=255)),
                ('applied', models.DateTimeField()),
            ],
            options={
                'db_table': 'django_migrations',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoSession',
            fields=[
                ('session_key', models.CharField(max_length=40, primary_key=True, serialize=False)),
                ('session_data', models.TextField()),
                ('expire_date', models.DateTimeField()),
            ],
            options={
                'db_table': 'django_session',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoSite',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('domain', models.CharField(max_length=100, unique=True)),
                ('name', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'django_site',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Faq',
            fields=[
                ('idx', models.AutoField(primary_key=True, serialize=False)),
                ('type', models.IntegerField()),
                ('title', models.CharField(max_length=256)),
                ('contents', models.TextField()),
                ('upload_time', models.DateTimeField()),
                ('views', models.IntegerField()),
            ],
            options={
                'db_table': 'FAQ',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('idx', models.AutoField(primary_key=True, serialize=False)),
                ('fk_user_idx', models.IntegerField()),
                ('title', models.CharField(max_length=45)),
                ('description', models.CharField(blank=True, max_length=45, null=True)),
                ('price', models.CharField(max_length=45)),
                ('url', models.TextField()),
                ('fk_category_level0', models.IntegerField()),
                ('fk_category_level1', models.IntegerField()),
                ('fk_category_level2', models.IntegerField()),
                ('fk_category_level3', models.IntegerField()),
                ('upload_time', models.DateTimeField()),
                ('ai_connection', models.PositiveIntegerField()),
                ('disabled_item_status', models.PositiveIntegerField()),
            ],
            options={
                'db_table': 'item',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Itemcategory',
            fields=[
                ('idx', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=50)),
                ('level', models.IntegerField()),
            ],
            options={
                'db_table': 'itemCategory',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ItemDetail',
            fields=[
                ('idx', models.AutoField(primary_key=True, serialize=False)),
                ('fk_video_idx', models.IntegerField()),
                ('fk_item_idx', models.IntegerField(blank=True, null=True)),
                ('position', models.PositiveBigIntegerField()),
                ('position_time', models.FloatField()),
                ('x', models.FloatField()),
                ('y', models.FloatField()),
                ('width', models.FloatField()),
                ('height', models.FloatField()),
                ('fk_label_idx', models.IntegerField(blank=True, null=True)),
                ('category', models.CharField(max_length=256)),
            ],
            options={
                'db_table': 'item_detail',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Itemoptions',
            fields=[
                ('idx', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=450)),
                ('value', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'itemOptions',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ItemTag',
            fields=[
                ('idx', models.AutoField(primary_key=True, serialize=False)),
                ('tag', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'item_tag',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Label',
            fields=[
                ('idx', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=256)),
            ],
            options={
                'db_table': 'label',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Notice',
            fields=[
                ('idx', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=256)),
                ('contents', models.TextField()),
                ('upload_time', models.DateTimeField()),
                ('views', models.IntegerField()),
            ],
            options={
                'db_table': 'notice',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ProcessAi',
            fields=[
                ('idx', models.AutoField(primary_key=True, serialize=False)),
                ('progress', models.IntegerField(blank=True, null=True)),
                ('draw_img_name', models.CharField(blank=True, max_length=256, null=True)),
                ('ai_status', models.PositiveIntegerField()),
            ],
            options={
                'db_table': 'process_ai',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='QnA',
            fields=[
                ('idx', models.AutoField(primary_key=True, serialize=False)),
                ('type', models.IntegerField()),
                ('title', models.CharField(max_length=256)),
                ('contents', models.TextField()),
                ('answer', models.TextField(blank=True, null=True)),
                ('answered_name', models.CharField(blank=True, max_length=50, null=True)),
                ('status', models.IntegerField()),
                ('upload_time', models.DateTimeField()),
                ('answered_time', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'QnA',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('idx', models.AutoField(primary_key=True, serialize=False)),
                ('id', models.CharField(max_length=256)),
                ('email', models.CharField(max_length=256)),
                ('pw', models.CharField(max_length=256)),
                ('name', models.CharField(max_length=50)),
                ('dept', models.CharField(blank=True, max_length=45, null=True)),
                ('phone', models.CharField(blank=True, max_length=11, null=True)),
                ('tier', models.IntegerField()),
                ('status', models.PositiveIntegerField()),
                ('tier_modify_notify', models.PositiveIntegerField()),
                ('admin_notify', models.PositiveIntegerField()),
                ('disabled_user_status', models.PositiveIntegerField()),
            ],
            options={
                'db_table': 'user',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='UserAlarm',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('idx', models.IntegerField()),
                ('fk_user_idx', models.IntegerField()),
                ('contents', models.CharField(blank=True, max_length=1024, null=True)),
            ],
            options={
                'db_table': 'user_alarm',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Userconnection',
            fields=[
                ('idx', models.AutoField(primary_key=True, serialize=False)),
                ('login_time', models.DateTimeField()),
                ('logout_time', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'userConnection',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('idx', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=256)),
                ('description', models.CharField(blank=True, max_length=1024, null=True)),
                ('duration', models.IntegerField()),
                ('url', models.TextField()),
                ('thumbnail', models.TextField()),
                ('category', models.IntegerField()),
                ('platform', models.CharField(max_length=50)),
                ('view', models.IntegerField()),
                ('upload_time', models.DateTimeField()),
                ('ai_connection', models.IntegerField()),
                ('transmission_status', models.IntegerField()),
                ('disabled_video_status', models.IntegerField()),
                ('total_frame', models.CharField(blank=True, max_length=50, null=True)),
            ],
            options={
                'db_table': 'video',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='VideoTag',
            fields=[
                ('idx', models.AutoField(primary_key=True, serialize=False)),
                ('tag', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'video_tag',
                'managed': False,
            },
        ),
    ]
