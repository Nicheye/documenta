from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import render,redirect
from acting . models import *
from django.db.models import Q
from .models import User
# class HomeView(APIView):
#    permission_classes = (IsAuthenticated, )
#    def get(self, request):
#        content = {'message': f'Welcome to the JWT Authentication page using React Js and Django {request.user}!'}
#        return Response(content)
class RegisterView(APIView):
	def post(self,request):
               serializer =  UserSerializer(data=request.data)
               ip_adress = request.data['ip_adress']
               serializer.is_valid(raise_exception=True)
               serializer.save(ip_adress=ip_adress)
               
               return Response(serializer.data)
          
		

class LogoutView(APIView):
     permission_classes = (IsAuthenticated,)
     def post(self, request):
          
          try:
               refresh_token = request.data["refresh_token"]
               token = RefreshToken(refresh_token)
               token.blacklist()
               return Response(status=status.HTTP_205_RESET_CONTENT)
          except Exception as e:
               return Response(status=status.HTTP_400_BAD_REQUEST)
def home(request):
     
     user = request.user
     if user.is_authenticated==True:
          if user.is_superuser ==True:
               acts = Act.objects.all()
               sum_aps = 0
               for act in acts:
                    sum_aps+=act.count
               return render(request,'main/Dashboard.html',{'acts':acts,'total':sum_aps})
     else:
          return redirect('login')
     return render(request,'main/home.html')

def active_acts(request):
     user = request.user
     if user.is_superuser ==True:
          documents = Document.objects.filter(is_active=True,is_aproved=True).order_by('-created_at')
          return render(request,'main/Active_acts.html',{'acts':documents,})
     return render(request,'main/home.html')
def closed_acts(request):
     user = request.user
     if user.is_superuser ==True:
          documents = Document.objects.filter(is_active=False,is_aproved=True).order_by('-created_at')
          return render(request,'main/Closed_acts.html',{'acts':documents,})
     return render(request,'main/home.html')
def active_searchBar(request):
      
     user = request.user
     if user.is_superuser ==True:
          if request.method == 'GET':
               
               
               query =  request.GET.get('query')
               if query:
                    
                    documents = Document.objects.filter(Q(created_by__username__icontains=query) | Q(created_at__icontains=query) | Q(act__name__icontains=query) | Q(country__icontains=query) | Q(city__icontains=query) | Q(street__icontains=query) | Q(building__icontains=query)| Q(apartment__icontains=query) ,is_active=True,is_aproved=True).order_by('-created_at')
                    
                    return render(request,'main/Active_acts.html',{'acts':documents,})

               else:
                    print("No information to show")
                    return render(request,"main/home",{})

def closed_searchBar(request):
      
     user = request.user
     if user.is_superuser ==True:
          if request.method == 'GET':
               
               
               query =  request.GET.get('query')
               if query:
                    
                    documents = Document.objects.filter(Q(created_by__username__icontains=query) | Q(created_at__icontains=query) | Q(act__name__icontains=query) | Q(country__icontains=query) | Q(city__icontains=query) | Q(street__icontains=query) | Q(building__icontains=query)| Q(apartment__icontains=query) ,is_active=False,is_aproved=True).order_by('-created_at')
                    
                    return render(request,'main/Closed_acts.html',{'acts':documents,})

               else:
                    print("No information to show")
                    return render(request,"main/home.html",{})
               
def request_register_screen(request):
     user = request.user
     if user.is_superuser ==True:
          un_accepted_users = User.objects.filter(is_proved=False,is_declined=False)
          # accepted_users = User.objects.filter(is_proved=True,is_declined=False)
          
          return render(request,'main/Request_users.html',{'users':un_accepted_users})
     
def active_users_screen(request):
     user = request.user
     if user.is_superuser ==True:
          active_users = User.objects.filter(is_proved=True,is_declined=False)
          # accepted_users = User.objects.filter(is_proved=True,is_declined=False)
          
          return render(request,'main/Active_users.html',{'users':active_users})

def accept_user(request,id):
     user_inst = User.objects.get(id=id)
     user_inst.is_proved=True
     user_inst.save()
     return redirect("request_register_screen")

def decline_user(request,id):
     user_inst = User.objects.get(id=id)
     user_inst.is_declined=True
     user_inst.save()
     return redirect("request_register_screen")

def decline_active_user(request,id):
     user_inst = User.objects.get(id=id)
     user_inst.is_declined=True
     user_inst.is_active=False
     user_inst.is_proved=True
     
     user_inst.save()
     return redirect("active_users")

