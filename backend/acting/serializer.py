from rest_framework import serializers

from .models import *

class Act_serializer(serializers.ModelSerializer):
	class Meta:
		model =Act
		fields = ['name','count','id']


class Document_serializer(serializers.ModelSerializer):
	created_by = serializers.SerializerMethodField()
	act = serializers.SerializerMethodField()
	document = serializers.SerializerMethodField()
	preview = serializers.SerializerMethodField()
	created_at = serializers.SerializerMethodField()
	water = serializers.SerializerMethodField()
	elictricity = serializers.SerializerMethodField()
	gas = serializers.SerializerMethodField()
	class Meta:
		model = Document
		fields = ['created_by',
			'created_at',
			'act',
			'country',
			'city',
			'street',
			'building',
			'apartment',
			'apartment',
			'is_active',
			'document',
			'preview',
			'device',
			'id',
			'is_sent',
			'water',
			'water_text',
			'elictricity',
			'elictiricity_text',
			'gas',
			'gas_text',
			]
	def get_created_by(self, obj):
		return obj.created_by.username if obj.created_by else None
        # Accessing created_by from obj, not from self
    
	def get_act(self, obj):
		return obj.act.name if obj.act else None
        # Access act attribute from the Document instance obj
   
	def get_water(self,obj):
		return "http://127.0.0.1:8000" + str(obj.water.url) if obj.water else None
		
	def get_document(self,obj):
		return "http://127.0.0.1:8000" + str(obj.document.url) if obj.document else None
	
	def get_preview(self,obj):
		return "http://127.0.0.1:8000" + str(obj.preview.url) if obj.preview else None
	# def get_sign(self,obj):
	# 	return "http://127.0.0.1:8000" + str(obj.sign.url) if obj.sign else None
	def get_created_at(self,obj):
		return str(obj.created_at.date()) if obj.created_at else None
	def get_elictricity(self,obj):
		return "http://127.0.0.1:8000" + str(obj.elictricity.url) if obj.elictricity else None
	
	def get_gas(self,obj):
		return "http://127.0.0.1:8000" + str(obj.gas.url) if obj.gas else None
	
class Detail_serializer(serializers.ModelSerializer):
	doc = serializers.SerializerMethodField()
	class Meta:
		model = Detail
		fields = ['doc','room','id']
	def get_doc(self,obj):
		return str(obj.doc.city) if obj.doc.city else None  + " " + str(obj.doc.street) if obj.doc.street else None  + " " + str(obj.doc.device) if obj.doc.device else None


class Ownership_serializer(serializers.ModelSerializer):
	doc = serializers.SerializerMethodField()
	sign = serializers.SerializerMethodField()
	class Meta:
		model = OwnerShip
		fields = ['name','doc','status','email','sign','id']
	def get_doc(self,obj):
		return str(obj.doc.city) if obj.doc.city else None  + " " + str(obj.doc.street) if obj.doc.street else None  + " " + str(obj.doc.device) if obj.doc.device else None
	def get_sign(self,obj):
		if obj.sign:
			return "http://127.0.0.1:8000" + str(obj.sign.url) if obj.sign else None

class Element_serializer(serializers.ModelSerializer):
	detail = serializers.SerializerMethodField()
	class Meta:
		model = Element
		fields =['name','comments','detail','id']
	
	def get_detail(self,obj):
		if obj.detail:
			return str(obj.detail.room)

class Element_photo_serializer(serializers.ModelSerializer):
	photo = serializers.SerializerMethodField()
	element = serializers.SerializerMethodField()
	class Meta:
		model = Element_photo
		fields = ['photo','element','id']
	def get_photo(self,obj):
		return "http://127.0.0.1:8000" + str(obj.photo.url) if obj.photo else None
	def get_element(self,obj):
		return str(obj.element.name) if obj.element.name else None

class Keys_serializer(serializers.ModelSerializer):
	class Meta:
		model = Keys
		keys_image = serializers.SerializerMethodField()
		doc = serializers.SerializerMethodField()
		fields = ['keys_image','door','mailbox','k_from_b','parking','remote_contrls','ac_controls','comments','doc']
	def get_keys_image(self,obj):
		return "http://127.0.0.1:8000" + str(obj.keys_image.url) if obj.keys_image else None
	def get_doc(self,obj):
		return str(obj.doc.city) if obj.doc.city else None  + " " + str(obj.doc.street) if obj.doc.street else None  + " " + str(obj.doc.device) if obj.doc.device else None
	


	
	