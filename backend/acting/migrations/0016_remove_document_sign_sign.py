# Generated by Django 4.2.6 on 2024-04-10 08:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('acting', '0015_remove_detail_description_remove_document_landlord_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='document',
            name='sign',
        ),
        migrations.CreateModel(
            name='Sign',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sign', models.ImageField(blank=True, null=True, upload_to='media/signs')),
                ('doc', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='acting.document')),
            ],
        ),
    ]
