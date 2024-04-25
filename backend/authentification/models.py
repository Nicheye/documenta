from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class User(AbstractUser):
	username = models.CharField(max_length=255,unique=True)
	email = models.CharField(max_length=255)
	password = models.CharField(max_length=255)
	USERNAME_FIELD = 'username'
	is_proved = models.BooleanField(default=False)
	password_look = models.CharField(max_length=255,default=None,null=True,blank=True)
	ip_adress = models.CharField(max_length=1243,blank=True,null=True)
	is_declined = models.BooleanField(default=False)
	REQUIRED_FIELDS = []
	