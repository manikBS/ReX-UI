# Generated by Django 5.0.6 on 2024-11-01 04:08

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('reports', '0011_reporttemplate_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reporttemplate',
            name='file',
            field=models.BinaryField(),
        ),
    ]
