
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from .views import *
urlpatterns = [
      #path('home/',HomeView.as_view(), name ='home'),
    path('',home,name='admin_home'),
	path('admin_acts/',active_acts,name='active_acts'),
	path('admin_closed_acts/',closed_acts,name='closed_acts'),
	path('api_logout/', LogoutView.as_view(), name ='logout_api'),
	path('active_search/',active_searchBar,name="active_search"),
	path('closed_search/',closed_searchBar,name="closed_search"),
	path('accept_users/',request_register_screen,name='request_register_screen'),
    path('active_users/',active_users_screen,name='active_users'),
	path('accept/<int:id>',accept_user,name='accept_user_admin'),
	path('decline/<int:id>',decline_user,name='decline_user_admin'),
    path('decline_active/<int:id>',decline_active_user,name='decline_active_user'),
    path('register/',RegisterView.as_view(),name='register'),
]