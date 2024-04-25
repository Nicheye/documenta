from django.contrib import admin

# Register your models here.
from .models import *
admin.site.register(Act)
admin.site.register(Detail)
admin.site.register(Document)
admin.site.register(Element)
admin.site.register(Element_photo)
admin.site.register(Keys)

admin.site.register(OwnerShip)
