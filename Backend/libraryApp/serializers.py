from rest_framework import serializers
from .models import *


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'


# class BookSerializer(serializers.ModelSerializer):
#     category_name = serializers.CharField(source='category.name', read_only=True)
#     author_name = serializers.CharField(source='author.name', read_only=True)
#     class Meta:
#         model = Book
#         fields = ['id', 'title', 'category', 'category_name', 'author', 'author_name', 'isbn', 'price', 'cover_page', 'is_issued', 'quantity', 'created_at', 'updated_at']
        

class BookSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    author_name = serializers.CharField(source='author.name', read_only=True)
    cover_page = serializers.SerializerMethodField()   # ← add this

    def get_cover_page(self, obj):                     # ← add this
        if obj.cover_page:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cover_page.url)
            return f"http://127.0.0.1:8000{obj.cover_page.url}"
        return None

    class Meta:
        model = Book
        fields = ['id', 'title', 'category', 'category_name', 'author', 
                  'author_name', 'isbn', 'price', 'cover_page', 
                  'is_issued', 'quantity', 'created_at', 'updated_at']