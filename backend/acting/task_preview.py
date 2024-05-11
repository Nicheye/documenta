from PIL import Image
import os
from datetime import timedelta
from docx.shared import Pt
from django.core.files.base import ContentFile
from django.utils import timezone
from celery import shared_task
from celery.utils.log import get_task_logger
from docxcompose.composer import Composer
from docx import Document as Document_compose
from docxtpl import DocxTemplate, InlineImage
from .serializer import *
from .models import Document as Dock
from datetime import datetime

from pathlib import Path
import subprocess
import magic
from .tasks import image_to_jpg
import logging
# Initialize logger
logger = get_task_logger(__name__)
logger.setLevel(logging.DEBUG)

room_path = 'backend/docs_templates/room_act.docx'
final_path = 'backend/docs_templates/final_act.docx'


@shared_task
def create_preview(document_id):
    document = Dock.objects.get(id=document_id)
    if document:
        tenants = OwnerShip.objects.filter(doc=document, status='tenant')
        main_tenant = tenants.first()

        ll = OwnerShip.objects.filter(doc=document, status='landlord')
        main_ll = ll.first()

        owners = OwnerShip.objects.filter(doc=document, status='owner')

        address = str(document.country) + str(document.city) + str(document.street) + str(document.building) + str(document.apartment) or None
        
        gas = image_to_jpg(document.gas) if document.gas else 'backend/docs_templates/No_Image_Available.jpg'
        gas_text = document.gas_text if document.gas_text else None
        water = image_to_jpg(document.water) if document.water else 'backend/docs_templates/No_Image_Available.jpg'
        water_text = document.water_text if document.water_text else None
        electricity = image_to_jpg(document.elictricity) if document.elictricity else 'backend/docs_templates/No_Image_Available.jpg'
        electricity_text = document.elictiricity_text if document.elictiricity_text else None
        
        keys = Keys.objects.get(doc=document)
        if keys:
            keys_photo = image_to_jpg(keys.keys_image) if keys.keys_image else 'backend/docs_templates/No_Image_Available.jpg'
            door = keys.door 
            mailbox = keys.mailbox
            k_from_b = keys.k_from_b 
            garage = keys.parking 
            remote_controls = keys.remote_contrls 
            ac_controls = keys.ac_controls 
            comments = keys.comments 

            template_path = 'backend/docs_templates/act_start.docx'  # Path to your template Word document
            output_path =  f'backend/tmp_images/{document_id}.docx'    # Path to save the filled Word document
            
            doc = DocxTemplate(template_path)
            data = {
                'main_tenant': main_tenant.name if main_tenant else '',
                'main_ll': main_ll.name if main_ll else '',
                'act': document.act,
                'address': address,
                'gas': InlineImage(doc, image_descriptor=gas, width=Pt(300), height=Pt(200)),
                'gas_text': gas_text,
                'water': InlineImage(doc, image_descriptor=water, width=Pt(300), height=Pt(200)),
                'water_text': water_text,
                'elictricity': InlineImage(doc, image_descriptor=electricity, width=Pt(300), height=Pt(200)),
                'elicticity_text': electricity_text,
                'keys_photo': InlineImage(doc, image_descriptor=keys_photo, width=Pt(300), height=Pt(200)),
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

            # Iterate over rooms and append them to the composed document
            rooms = Detail.objects.filter(doc_id=document_id)  
            for room in rooms:
                output_path_room = f'backend/tmp_images/room_{room.id}.docx'
                doc_room = DocxTemplate(room_path)
                elements = Element.objects.filter(detail=room)
                elem_arr = []
                for element in elements:
                    # Process each element and its photos
                    p_ob = []
                    photos = Element_photo.objects.filter(element=element)
                    elem_ser = Element_serializer(element).data
                    elem_ser['images'] = p_ob

                    for photo in photos:
                        img_obj = InlineImage(doc_room, image_to_jpg(photo.photo), width=Pt(300), height=Pt(200))
                        if img_obj:
                            p_ob.append(img_obj)
                    elem_arr.append(elem_ser)

                context2 = {'elements': elem_arr, 'room_name': room.room}
                doc_room.render(context2)
                doc_room.save(output_path_room)
                
                try:
                    composer.append(Document_compose(output_path_room))
                except Exception as e:
                    logger.error(f"Error appending room document: {e}")

            

            # Save the composed document to the database
            composer.save(output_path)
            with open(output_path, 'rb') as file:
                    document.preview.save(f'preview_{document_id}.docx', ContentFile(file.read()))
            