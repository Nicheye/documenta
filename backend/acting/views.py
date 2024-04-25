from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import *
from rest_framework import status
from .serializer import *
from django.core.mail import EmailMessage
from authentification.serializers import UserSerializer
from .tasks import create_document
# from .tasks import my_background_task
class Home_User_View(APIView):
	permission_classes = [IsAuthenticated,]
	def get(self,request):
		user = request.user
		if user.is_proved==True:
			user_ser = UserSerializer(user)
			active_acts = Document.objects.filter(is_aproved=True,is_active=True,created_by=user)
			active_ser = Document_serializer(active_acts,many=True)
			draft_acts = Document.objects.filter(is_aproved=False,is_active=True,created_by=user).order_by('-id')
			draft_ser = Document_serializer(draft_acts,many=True)

			return Response({
				'user':user_ser.data,
				'active_acts':active_ser.data,
				'drafts_acts':draft_ser.data,
			})
		else:
			return Response({
				'info':'u r not confirmed',
				
			})
	    
			
		



class Main_Act_View(APIView):
	permission_classes = [IsAuthenticated, ]
	def get(self,request,*args,**kwargs):
		# my_background_task.delay("dat","dq3")
		if request.user.is_proved==True:
			id = kwargs.get('id',None)
			if id is not None:
				doc = Document.objects.get(id=id)
				ser = Document_serializer(doc)
				acts = Act.objects.all()
				acts_ser = Act_serializer(acts,many=True)
				user = UserSerializer(request.user)
				return Response({'data':ser.data,'acts':acts_ser.data,'user':user.data},status=status.HTTP_202_ACCEPTED)
			acts = Act.objects.all()
			acts_ser = Act_serializer(acts,many=True)
			user = UserSerializer(request.user)

			return Response({'acts':acts_ser.data,
							'user':user.data})
		else:
			return Response({'info':"u r not confirmed"})
	def post(self, request):
			if request.user.is_proved == True:
				try:
					data = request.data
					doc_serializer = Document_serializer(data=data)

					if doc_serializer.is_valid(raise_exception=True):
						# Extract act ID from request data
						act_id = data.get('act')
						# Retrieve Act instance
						act_instance = Act.objects.get(pk=act_id)
						act_instance.count += 1
						act_instance.save()
						# Assign act_instance to the act field of the Document
						doc_serializer.validated_data['act'] = act_instance
						
						# Assign the current user to the created_by field of the Document
						doc_serializer.save(created_by=request.user,is_active=True)
						
						# Check if water image and electricity image are present in request data
						water_image = request.FILES.get('water')
						elictricity_image = request.FILES.get('elictricity')
						gas_image = request.FILES.get('gas')
						if water_image:
							doc_serializer.instance.water = water_image
						if elictricity_image:
							doc_serializer.instance.elictricity = elictricity_image
						
						if gas_image:
							doc_serializer.instance.gas = gas_image
						
						# Save the document instance with updated image fields
						
						doc_serializer.instance.save()

						return Response({'data': doc_serializer.data}, status=status.HTTP_201_CREATED)
					else:
						return Response(doc_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
				except Exception as e:
					return Response({'info': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
			else:
				return Response({'info': "u r not confirmed"})
	def patch(self,request,*args,**kwargs):
		if request.user.is_proved == True:
			id=kwargs.get('id',None)
			if id is not None:
				doc = Document.objects.get(id=id)
				data = request.data
				ser = Document_serializer(doc,data=data)
				if ser.is_valid(raise_exception=True):
					act_id = data.get('act')
						# Retrieve Act instance
					act_instance = Act.objects.get(pk=act_id)
						# Assign act_instance to the act field of the Document
					ser.validated_data['act'] = act_instance
						
						# Assign the current user to the created_by field of the Document
					ser.save(created_by=request.user,is_active=True)
						
						# Check if water image and electricity image are present in request data
					water_image = request.FILES.get('water')
					elictricity_image = request.FILES.get('elictricity')
					gas_image = request.FILES.get('gas')
					if water_image:
						ser.instance.water = water_image
					if elictricity_image:
						ser.instance.elictricity = elictricity_image
						
					if gas_image:
						ser.instance.gas = gas_image
						
						# Save the document instance with updated image fields
						
					ser.instance.save()

					return Response({'data': ser.data}, status=status.HTTP_202_ACCEPTED)
		else:
			return Response({'info': "u r not confirmed"})
	
	def delete(self,request,*args,**kwargs):
		if request.user.is_proved == True:
			try:
				id=kwargs.get('id',None)
				doc = Document.objects.get(id=id)
				if doc:
					doc.delete()
					return Response({'everythin successuflly deleteed'})
			except Exception as e:
				return Response({'message':str(e)})





class Tenants_Owners_LL_View(APIView):
	permission_classes = [IsAuthenticated,]
	def get(self,request,*args,**kwargs):
		if request.user.is_proved==True:
			id = kwargs.get("id",None)
			if id is not None:
				doc = Document.objects.get(id=id)
				ownerships = OwnerShip.objects.filter(doc=doc).order_by('-id')
				ser = Ownership_serializer(ownerships,many=True)
				return Response({'data':ser.data,'user':str(request.user	)},status=status.HTTP_200_OK)
		else:
			return Response({'info':"u r not confirmed"})
	def post(self,request,*args,**kwargs):
		if request.user.is_proved==True:
			data = request.data
			id = kwargs.get("id",None)
			if id is not None:
				sign=data['sign']
				doc = Document.objects.get(id=id)
				ser = Ownership_serializer(data=data)
				if ser.is_valid(raise_exception=True):
					ser.save(doc=doc,sign=sign)
					return Response({'data':ser.data},status=status.HTTP_201_CREATED)
		else:
			return Response({'info':"u r not confirmed"})
	
	def delete(self,request,*args,**kwargs):
		if request.user.is_proved==True:
			id = kwargs.get('id',None)
			if id is not None:
				instance = OwnerShip.objects.get(id=id)
				instance.delete()
				return Response({'message':'successfully deleted ownership'})
		else:
			return Response({'info':"u r not confirmed"})
	

class Detail_View(APIView):
	permission_classes = [IsAuthenticated, ]
	def get(self,request,*args,**kwargs):
		if request.user.is_proved==True:
			id  =kwargs.get('id',None)
			user =request.user
			user_ser = UserSerializer(user)
			if id is not None:
				document = Document.objects.get(id=id)
				details = Detail.objects.filter(doc=document)
				details_ser = Detail_serializer(details,many=True)
				return Response({'data':details_ser.data,
								'user':user_ser.data})
		else:
			return Response({'info':"u r not confirmed"})
	
	def post(self,request,*args,**kwargs):
		if request.user.is_proved==True:
			id  =kwargs.get('id',None)
			if id is not None:
				data  = request.data
				document = Document.objects.get(id=id)
				detail_ser =Detail_serializer(data=data)
				if detail_ser.is_valid(raise_exception=True):
					detail_ser.save(doc=document)
					return Response({"data":detail_ser.data})
		else:
			return Response({'info':"u r not confirmed"})
	def delete(self,request,*args,**kwargs):
		if request.user.is_proved==True:
			id = kwargs.get('id',None)
			if id is not None:
				instance = Detail.objects.get(id=id)
				instance.delete()
				return Response({'message':'successfully deleted detail'})
		else:
			return Response({'info':"u r not confirmed"})	
		



class Rooms_View(APIView):
	permission_classes =[IsAuthenticated,]
	def get(self,request,*args,**kwargs):
		if request.user.is_proved==True:
			id = kwargs.get('id',None)
			if id is not None:
				doc = Document.objects.get(id=id)
				rooms = Detail.objects.filter(doc=doc)
				rooms_ser = Detail_serializer(rooms,many=True)
				return Response({'data':rooms_ser.data,'user':str(request.user)},status=status.HTTP_200_OK)
		else:
			return Response({'info':"u r not confirmed"})
	def post(self,request,*args,**kwargs):
		if request.user.is_proved==True:
			id = kwargs.get('id',None)
			if id is not None:
				doc = Document.objects.get(id=id)
				data =request.data
				ser = Detail_serializer(data=data)
				if ser.is_valid(raise_exception=True):
					ser.save(doc=doc)
					return Response({'data':ser.data},status=status.HTTP_201_CREATED)
		else:
			return Response({'info':"u r not confirmed"})




class Element_View(APIView):
	permission_classes = [IsAuthenticated,]
	def get(self,request,*args,**kwargs):
		if request.user.is_proved==True:
			id = kwargs.get('id',None)
			if id is not None:
				detail = Detail.objects.get(id=id)
				alr_elements = Element.objects.filter(detail=detail)
				alr_e_ser= Element_serializer(alr_elements,many=True)
				return Response({'data':alr_e_ser.data,'user':str(request.user)},status=status.HTTP_200_OK) 
		else:
			return Response({'info':"u r not confirmed"})
	
	def post(self,request,*args,**kwargs):
		if request.user.is_proved==True:
			id = kwargs.get('id',None)
			if id is not None:
				detail = Detail.objects.get(id=id)
				data = request.data
				el_ser = Element_serializer(data=data)
				if el_ser.is_valid(raise_exception=True):
					el_ser.save(detail=detail)
					return Response({'data':el_ser.data},status=status.HTTP_201_CREATED)
		else:
			return Response({'info':"u r not confirmed"})
	
	def delete(self,request,*args,**kwargs):
		if request.user.is_proved==True:
			id = kwargs.get('id',None)
			if id is not None:
				instance = Element.objects.get(id=id)
				instance.delete()
				return Response({'message':'successfully deleted element'})
		else:
			return Response({'info':"u r not confirmed"})
	

class Element_Photo_View(APIView):
	permission_classes = [IsAuthenticated ,]
	def get(self,request,*args,**kwargs):
		id = kwargs.get("id",None)
		if id is not None:
			element_obj =Element.objects.get(id=id)
			photos_obj = Element_photo.objects.filter(element=element_obj)
			photos_ser = Element_photo_serializer(photos_obj,many=True)
			return Response({
				'photos':photos_ser.data,
				'room':f'{element_obj.detail.room}  ( {element_obj.name} ) ',
				
			})
	def post(self,request,*args,**kwargs):
		id = kwargs.get("id",None)
		if id is not None:
			element_obj = Element.objects.get(id=id)
			data = request.data
			
			photos_obj = Element_photo_serializer(data=request.data)
			if photos_obj.is_valid(raise_exception=True):
				photos_obj.photo = request.data['photo']
				photos_obj.save(element=element_obj,photo = request.data['photo'])
				return Response({'data':photos_obj.data})
	
	def delete(self,request,*args,**kwargs):
		if request.user.is_proved==True:
			id = kwargs.get('id',None)
			if id is not None:
				instance = Element_photo.objects.get(id=id)
				instance.delete()
				return Response({'message':'successfully deleted element'})
		else:
			return Response({'info':"u r not confirmed"})



class File_View(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if request.user.is_proved:
            id = kwargs.get('id', None)
            if id is not None:
                try:
                    doc = Document.objects.get(id=id)
                except Document.DoesNotExist:
                    return Response({'error': 'Document not found'}, status=404)

                if not doc.document:
                    # Assuming create_document creates a document if it doesn't exist
                    create_document(doc.id)

                elif doc.document and doc.is_sent==False:
                    address = str(doc.country) + str(doc.street) + str(doc.building) + str(doc.apartment)
                    email_subject = f"{address} Document Subject"
                    email_body = "Please find the attached document."
                    from_email = "your_email@example.com"

                    email_pool = ['miduibwqbdhbuqwidwqdqwdxq@gmail.com', doc.created_by.email]
                    email = EmailMessage(email_subject, email_body, from_email, email_pool)
                    with open(doc.document.path, 'rb') as doc_file:
                        email.attach(doc.document.name, doc_file.read(), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                        print("sent")
                    try:
                        email.send()
                        doc.is_sent = True
                        doc.is_aproved = True
                        doc.save()
                    except Exception as e:
                        return Response({'error': 'Failed to send email'}, status=500)

                doc_ser = Document_serializer(doc)
                user_ser = UserSerializer(request.user)
                return Response({'data': doc_ser.data, 'user': user_ser.data})

        return Response({'info': "You are not confirmed"}, status=403)


class Key_View(APIView):
	permission_classes = [IsAuthenticated, ]
	def get(self,request,*args,**kwargs):
		if request.user.is_proved == True:
			id = kwargs.get('id',None)
			if id is not None:
				doc_obj = Document.objects.get(id=id)
				key_obj = Keys.objects.get(doc=doc_obj)
				key_ser = Keys_serializer(key_obj)
				return Response({'data':key_ser.data},status=status.HTTP_200_OK)
		else:
			return Response({'info': "u r not confirmed"})
	def post(self, request):
			if request.user.is_proved == True:
				try:
					data = request.data
					doc_id = data.get('doc')
					try:
						doc_cheeck_inst = Document.objects.get(pk=doc_id)
						key_check_obj = Keys.objects.get(doc=doc_cheeck_inst,created_by=request.user)
						return Response({"msg":"already key exists"})
					except:
						doc_serializer = Keys_serializer(data=data)

						if doc_serializer.is_valid():
							
							doc_id = data.get('doc')
							
							doc_instance = Document.objects.get(pk=doc_id)
							
							doc_serializer.validated_data['doc'] = doc_instance
							
							
							doc_serializer.save(created_by=request.user)
							
							
							keys_image = request.FILES.get('keys')
							if keys_image:
								doc_serializer.instance.keys_image = keys_image
							
							# Save the document instance with updated image fields
							
							doc_serializer.instance.save()

							return Response({'data': doc_serializer.data}, status=status.HTTP_201_CREATED)
						else:
							return Response(doc_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
				except Exception as e:
					return Response({'info': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
			else:
				return Response({'info': "u r not confirmed"})
	def patch(self,request,*args,**kwargs):
		if request.user.is_proved == True:
			try:
				data = request.data
				doc_id = data.get('doc')
				try:
					doc_cheeck_inst = Document.objects.get(pk=doc_id)
					key_check_obj = Keys.objects.get(doc=doc_cheeck_inst,created_by=request.user)
					new_key_ser = Keys_serializer(key_check_obj,data=data)
					if new_key_ser.is_valid(raise_exception=True):
						doc_id = data.get('doc')
						
							
						new_key_ser.validated_data['doc'] = doc_cheeck_inst
							
							
						new_key_ser.save(created_by=request.user)
							
							
						keys_image = request.FILES.get('keys')
						if keys_image:
							new_key_ser.instance.keys_image = keys_image
							
							# Save the document instance with updated image fields
							
						new_key_ser.instance.save()

						return Response({'data': new_key_ser.data}, status=status.HTTP_201_CREATED)
				except:
					doc_serializer = Keys_serializer(data=data)

					if doc_serializer.is_valid():
							
						doc_id = data.get('doc')
							
						doc_instance = Document.objects.get(pk=doc_id)
							
						doc_serializer.validated_data['doc'] = doc_instance
							
							
						doc_serializer.save(created_by=request.user)
							
							
						keys_image = request.FILES.get('keys')
						if keys_image:
							doc_serializer.instance.keys_image = keys_image
							
							# Save the document instance with updated image fields
							
						doc_serializer.instance.save()

						return Response({'data': doc_serializer.data}, status=status.HTTP_201_CREATED)
					else:
						return Response(doc_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
			except Exception as e:
				return Response({'data':str(e)})
		else:
			return Response({'info': "u r not confirmed"})

class Anihilation(APIView):
	permission_classes = [IsAuthenticated,]
	def get(self,request,*args,**kwargs):
		if request.user.is_proved == True:
			id = kwargs.get('id',None)
			if id is not None:
				doc =Document.objects.get(id=id)
				doc.document = ''
				doc.is_sent = False
				doc.save()
				return Response({'message':'ok'},status=status.HTTP_200_OK)
		
		else:
			return Response({'info': "u r not confirmed"})