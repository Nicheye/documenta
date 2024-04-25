from rest_framework import serializers
from .models import User
class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields =['id','username','password','ip_adress','email']
		extra_kwargs = {
			'password':{'write_only':True}
		}

	def create(self,validated_data):
		password = validated_data.pop('password',None)
		
		instance =  self.Meta.model(**validated_data)
		if password is not None:
			instance.password_look = password
			instance.set_password(password)
		
		
		instance.save()
		return instance