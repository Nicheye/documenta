# Generated by Django 5.0.4 on 2024-05-04 17:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('acting', '0022_document_preview'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='document',
            name='preview',
        ),
    ]
