from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from django.conf import settings
from django.conf.urls.static import static
from .views import *
urlpatterns = [
    path('act',Main_Act_View.as_view()),
	path('act/<int:id>',Main_Act_View.as_view()),
	path('detail/<int:id>',Detail_View.as_view()),
	
	path('files/<int:id>',File_View.as_view()),
	path('element_photo/<int:id>',Element_Photo_View.as_view()),
	path('ownership/<int:id>',Tenants_Owners_LL_View.as_view()),
	path('rooms/<int:id>',Rooms_View.as_view()),
	path('element/<int:id>',Element_View.as_view()),
	path('keys/',Key_View.as_view()),
	path('keys/<int:id>',Key_View.as_view()),
	path('user_home',Home_User_View.as_view()),

	path('clean_document/<int:id>',Anihilation.as_view())
]
