
from celery import shared_task
from celery.utils.log import get_task_logger
from .models import *
import os
from django.template.loader import render_to_string
from .serializer import *
from .models import Document as Dock
from django.utils import timezone
from django.core.files.base import ContentFile
from celery import shared_task
from docxcompose.composer import Composer
from docx import Document as Document_compose


logger = get_task_logger(__name__)
from datetime import datetime, timedelta
@shared_task
def my_periodic_task():
    # Your periodic task logic here
    manage_document()
    logger.info("Running periodic task...")

@shared_task
def manage_document():
    active_docs = Dock.objects.filter(is_aproved=True,is_active=True)
    for active_doc in active_docs:
        if  active_doc.created_at + timedelta(hours=72)<timezone.now():
            active_doc.is_active=False
            active_doc.save()
        if active_doc.created_by.is_active==False:
            active_doc.is_active=False
            active_doc.save()
    closed_docs = Dock.objects.filter(is_aproved=True,is_active=False)
    for closed_doc in closed_docs:
        if closed_doc.created_at + timedelta(hours=720)<timezone.now():
            closed_doc.delete()
    
def_path = 'backend/docs_templates/No_Image_Available.jpg'
room_path = 'backend/docs_templates/room_act.docx'
final_path = 'backend/docs_templates/final_act.docx'
@shared_task
def create_document(document_id):
    document = Dock.objects.get(id=document_id)
    if document:
        tenants = OwnerShip.objects.filter(doc=document,status='tenant')
        main_tenant =tenants.first()


        ll = OwnerShip.objects.filter(doc=document,status='landlord')
        main_ll = ll.first()


        owners = OwnerShip.objects.filter(doc=document,status='owner')

        address = str(document.country) + str(document.city) + str(document.street) + str(document.building) + str(document.apartment) or None
        
        gas = document.gas if document.gas else def_path
        gas_text = document.gas_text if document.gas_text else None
        water = document.water if document.water else def_path
        water_text = document.water_text if document.water_text else None
        elicticity = document.elictricity if document.elictricity else def_path
        elicticity_text = document.elictiricity_text if document.elictiricity_text else None
        key = Keys.objects.get(doc=document)
        if key:
            keys_photo = key.keys_image if key.keys_image else def_path
            door = key.door 
            mailbox = key.mailbox
            k_from_b = key.k_from_b 
            garage = key.parking 
            remote_controls = key.remote_contrls 
            ac_controls = key.ac_controls 
            comments = key.comments 
            template_path = 'backend/docs_templates/act_start.docx'  # Path to your template Word document
            output_path = f'backend/tmp_images/{document_id}.docx'  # Path to save the filled Word document
            
            doc = DocxTemplate(template_path)
            data = {
                'main_tenant':f'{main_tenant.name}' if main_tenant else '',
               
                'main_ll':f'{main_ll.name}' if main_ll else '',
                'act': document.act,
                
                'adress': address,
                
                'gas': InlineImage(doc, image_descriptor=f'{gas}', width=Pt(300), height=Pt(200)),
                'gas_text': gas_text,
                'water': InlineImage(doc, image_descriptor=f'{water}', width=Pt(300), height=Pt(200)),
                'water_text': water_text,
                'elictricity': InlineImage(doc, image_descriptor=f'{elicticity}', width=Pt(300), height=Pt(200)),
                'elicticity_text': elicticity_text,
                'keys_photo': InlineImage(doc, image_descriptor=f'{keys_photo}', width=Pt(300), height=Pt(200)),
                'door': door,
                'mailbox': mailbox,
                'k_from_b': k_from_b,
                'garage': garage,
                'remote_controls': remote_controls,
                'ac_controls': ac_controls,
                'comments': comments,
            }
            
            doc.render(data)
            doc.save(output_path)

            composer = Composer(Document_compose(output_path))

            rooms = Detail.objects.filter(doc_id=document_id)  

            for room in rooms:
                output_path_room = f'backend/tmp_images/room_{room.id}.docx'
                doc_room = DocxTemplate(room_path)
                elements = Element.objects.filter(detail=room)
                elem_arr = []
                for element in elements:
                    p_ob = []
                    photos = Element_photo.objects.filter(element=element)
                    elem_ser = Element_serializer(element).data
                    elem_ser['images']=p_ob

                    for photo in photos:
                        img_obj =InlineImage(doc_room,photo.photo,width=Pt(300), height=Pt(200))
                        p_ob.append(img_obj)
                    elem_arr.append(elem_ser)
                    elem_ser=0
                    p_b=[]

                    
                print(elem_arr)
                context2 = {'elements': elem_arr, 'room_name': room.room}
                doc_room.render(context2)
                doc_room.save(output_path_room)
                try:
                    composer.append(Document_compose(output_path_room))
                except:
                    pass
            #final
            output_path_final = f'backend/tmp_images/final_{document.id}.docx'
            doc_fin = DocxTemplate(final_path)
            tenants_arr=[]
            for tenant in tenants:
                sign = InlineImage(doc_fin,tenant.sign,width=Pt(300), height=Pt(200))
                tenant =Ownership_serializer(tenant).data
                
                tenant['sign']=sign
                tenants_arr.append(tenant)
            
            ll_arr=[]
            for l in ll:
                sign = InlineImage(doc_fin,l.sign,width=Pt(300), height=Pt(200))
                l =Ownership_serializer(l).data
                
                l['sign']=sign
                ll_arr.append(l)
            
            owners_arr=[]
            for owner in owners:
                sign = InlineImage(doc_fin,owner.sign,width=Pt(300), height=Pt(200))
                owner =Ownership_serializer(owner).data
                
                owner['sign']=sign
                owners_arr.append(owner)
            date =document.created_at.date()
            context2 = {'owners': owners_arr, 'landlords': ll_arr, 'tenants':tenants_arr,'date':date}
            doc_fin.render(context2)
            doc_fin.save(output_path_final)
            try:
                    composer.append(Document_compose(output_path_final))
            except:
                    pass
            # Save the composed document
            composer.save(output_path)
            

            # Save to the database
            with open(output_path, 'rb') as file:
                document.document.save(f'{document_id}.docx', ContentFile(file.read()))
        
            
            



from docxtpl import DocxTemplate,InlineImage
from PIL import Image
from io import BytesIO
from docx.shared import Pt

    
