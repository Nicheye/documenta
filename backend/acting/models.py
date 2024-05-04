from django.db import models
from authentification.models import User
# Create your models here.
class Act(models.Model):
	name = models.CharField(max_length=120)
	count = models.PositiveIntegerField(default=0)
	def __str__(self) -> str:
		return self.name

class Document(models.Model):
	created_by = models.ForeignKey(User,on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now_add=True)
	act = models.ForeignKey(Act,on_delete=models.CASCADE)
	country = models.CharField(max_length=120,null=True,blank=True)
	city = models.CharField(max_length=120,null=True,blank=True)
	street = models.CharField(max_length=120,null=True,blank=True)
	building = models.CharField(max_length=120,null=True,blank=True)
	apartment = models.CharField(max_length=120,null=True,blank=True)
	is_aproved = models.BooleanField(default=False)
	is_active= models.BooleanField(default=True)
	document = models.FileField(upload_to="media/documents",null=True,blank=True)
	device =models.CharField(max_length=120,default='',null=True,blank=True)
	
	last_updated = models.DateTimeField(auto_now=True)
	water = models.ImageField(upload_to="media/water",null=True,blank=True)
	water_text = models.CharField(max_length=100,null=True,blank=True)
	elictricity = models.ImageField(upload_to="media/elitricity",null=True,blank=True)
	elictiricity_text = models.CharField(max_length=100,null=True,blank=True)
	gas = models.ImageField(upload_to="media/gs",null=True,blank=True)
	gas_text = models.CharField(max_length=100,null=True,blank=True)
	is_sent = models.BooleanField(default=False)
	is_visible = models.BooleanField(default=True)
	def __str__(self) -> str:
		return str(self.created_by) + "  " + str(self.street)+ "  " + str(self.id)


class OwnerShip(models.Model):
	name = models.CharField(max_length=120,null=True,blank=True)
	doc= models.ForeignKey(Document,on_delete=models.CASCADE)
	email = models.CharField(max_length=80,default='opium',null=True,blank=True)
	status = models.CharField(max_length=120,null=True,blank=True)
	sign  =models.ImageField(upload_to='media/signs',null=True,blank=True)



class Detail(models.Model):
	doc = models.ForeignKey(Document,on_delete=models.CASCADE)
	room = models.CharField(max_length=100,null=True,blank=True)
	def __str__(self) -> str:
		return str(self.doc) + "  " + str(self.room)
	
class Element(models.Model):
	name = models.CharField(max_length=150,null=True,blank=True)
	comments = models.CharField(max_length=1500,null=True,blank=True)
	detail = models.ForeignKey(Detail,on_delete=models.CASCADE)

class Element_photo(models.Model):
	photo = models.ImageField(upload_to="media/room_details",null=True,blank=True)
	element = models.ForeignKey(Element,on_delete=models.CASCADE,blank=True,null=True)



class Keys(models.Model):
	doc = models.ForeignKey(Document,on_delete=models.CASCADE,default=1)
	keys_image = models.ImageField(upload_to="media/keys",null=True,blank=True)
	door = models.CharField(max_length=100,blank=True,null=True)
	mailbox = models.CharField(max_length=1000,blank=True,null=True)
	k_from_b = models.CharField(max_length=100,blank=True,null=True)
	parking = models.CharField(max_length=100,blank=True,null=True)
	remote_contrls = models.CharField(max_length=100,blank=True,null=True)
	ac_controls = models.CharField(max_length=100,blank=True,null=True)
	comments =models.TextField(blank=True,null=True)
	created_by = models.ForeignKey(User,on_delete=models.CASCADE,default=1)
