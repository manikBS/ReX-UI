# Generated by Django 5.0.6 on 2024-10-30 04:48

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('reports', '0009_remove_reporttemplate_template_data_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='reporttemplate',
            name='file',
        ),
    ]
