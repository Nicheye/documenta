# Generated by Django 4.2.6 on 2024-02-21 08:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentification', '0004_alter_user_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='active',
            field=models.BooleanField(default=True),
        ),
    ]
