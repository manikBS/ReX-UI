# Generated by Django 5.0.6 on 2024-11-01 07:57

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('reports', '0012_alter_reporttemplate_file'),
    ]

    operations = [
        migrations.AddField(
            model_name='reporttemplate',
            name='file_type',
            field=models.CharField(default='null', max_length=255),
            preserve_default=False,
        ),
    ]
