# Generated by Django 4.2.6 on 2024-04-13 10:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('acting', '0019_ownership_sign_delete_sign'),
    ]

    operations = [
        migrations.AddField(
            model_name='document',
            name='is_sent',
            field=models.BooleanField(default=False),
        ),
    ]
