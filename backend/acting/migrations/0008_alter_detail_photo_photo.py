# Generated by Django 4.2.6 on 2024-03-01 18:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('acting', '0007_remove_detail_photo_detail_photo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='detail_photo',
            name='photo',
            field=models.ImageField(blank=True, null=True, upload_to='media/room_details'),
        ),
    ]