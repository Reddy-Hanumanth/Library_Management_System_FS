from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from django.shortcuts import get_object_or_404


@api_view(['POST'])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None and user.is_staff:
        return Response({'success': True, 'message': 'Login successful', 'username': username}, status=200)
    else:
        return Response({'success': False, 'message': 'Invalid credentials'}, status=401)
    



@api_view(['POST'])
def add_category(request):
    name = request.data.get('name')
    category_status = request.data.get('status', "1")

    is_active = True if str(category_status) == "1" else False

    category = Category.objects.create(name=name, is_active=is_active)
    serializer = CategorySerializer(category)

    return Response(
        {
            'success': True, 
            'message': 'Category added successfully', 
            'category': serializer.data
        },  
        status=status.HTTP_201_CREATED,
    )


@api_view(['GET'])
def Category_list(request):
    categories = Category.objects.all().order_by("-id")
    serializer = CategorySerializer(categories, many=True) 

    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['PUT'])
def edit_category(request, id):
    category = get_object_or_404(Category, id=id)

    name = request.data.get('name', category.name)
    category_status = request.data.get('status', "1")

    is_active = True if str(category_status) == "1" else False

    category.name = name
    category.is_active = is_active
    category.save() 

    serializer = CategorySerializer(category)

    return Response(
        {
            'success': True, 
            'message': 'Category updated successfully', 
            'category': serializer.data
        },  
        status=status.HTTP_200_OK,
    )


@api_view(['DELETE'])
def delete_category(request, id):
    category = get_object_or_404(Category, id=id)
    category.delete()
    return Response(
        {
            'success': True, 
            'message': 'Category deleted successfully'
        },  
        status=status.HTTP_200_OK,
    )






@api_view(['POST'])
def add_author(request):
    name = request.data.get('name')

    author = Author.objects.create(name=name)
    serializer = AuthorSerializer(author)

    return Response(
        {
            'success': True, 
            'message': 'Author added successfully', 
            'author': serializer.data
        },  
        status=status.HTTP_201_CREATED,
    )




@api_view(['GET'])
def author_list(request):
    authors = Author.objects.all().order_by("-id")
    serializer = AuthorSerializer(authors, many=True) 

    return Response(serializer.data, status=status.HTTP_200_OK)




@api_view(['PUT'])
def edit_author(request, id):
    author = get_object_or_404(Author, id=id)

    name = request.data.get('name')

    author.name = name
    author.save()

    serializer = AuthorSerializer(author)

    return Response(
        {
            'success': True, 
            'message': 'Author updated successfully', 
            'author': serializer.data
        },  
        status=status.HTTP_200_OK,
    )


@api_view(['DELETE'])
def delete_author(request, id):
    author = get_object_or_404(Author, id=id)
    author.delete()
    return Response(
        {
            'success': True, 
            'message': 'Author deleted successfully'
        },  
        status=status.HTTP_200_OK,
    )












from rest_framework.decorators import parser_classes                 # These two helps to get Multiple Input types in a single API View(e.g., JSON data and file uploads)
from rest_framework.parsers import MultiPartParser, FormParser

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def add_Book(request):
    title = request.data.get('title')
    category_id = request.data.get('category')
    author_id = request.data.get('author')
    isbn = request.data.get('isbn')
    price = request.data.get('price')
    cover_page = request.FILES.get('cover_page')
    quantity = request.data.get('quantity')

    category = get_object_or_404(Category, id=category_id)
    author = get_object_or_404(Author, id=author_id)

    if Book.objects.filter(isbn=isbn).exists():
        return Response(
            {
                'success': False, 
                'message': 'A book with this ISBN already exists, please use a different ISBN'
            },  
            status=status.HTTP_400_BAD_REQUEST,
        )

    book = Book.objects.create(
        title=title,
        category=category,
        author=author,
        isbn=isbn,
        price=price,
        cover_page=cover_page,
        quantity=quantity
    )
    serializer = BookSerializer(book, context={'request': request})

    return Response(
        {
            'success': True, 
            'message': 'Book added successfully', 
            'book': serializer.data
        },  
        status=status.HTTP_201_CREATED,
    )




@api_view(['GET'])
def Book_list(request):
    books = Book.objects.all().order_by("-id")
    serializer = BookSerializer(books, many=True, context={'request': request}) 

    return Response(serializer.data, status=status.HTTP_200_OK)




@api_view(['PUT'])
@parser_classes([MultiPartParser, FormParser])
def edit_Book(request, id):
    book = get_object_or_404(Book, id=id)

    title = request.data.get('title')
    category_id = request.data.get('category')
    author_id = request.data.get('author')
    price = request.data.get('price')
    cover_page = request.FILES.get('cover_page')
    quantity = request.data.get('quantity')

    category = get_object_or_404(Category, id=category_id)
    author = get_object_or_404(Author, id=author_id)

    book.title = title
    book.category = category
    book.author = author
    book.price = price
    if cover_page:  # Only update cover_page if a new image is provided
        book.cover_page = cover_page
    book.quantity = quantity
    book.save()

    serializer = BookSerializer(book, context={'request': request})  # Pass the request in the context to get the full URL for the cover_page field

    return Response(
        {
            'success': True, 
            'message': 'Book updated successfully', 
            'book': serializer.data
        },  
        status=status.HTTP_200_OK, 
    )


@api_view(['DELETE'])
def delete_Book(request, id):
    book = get_object_or_404(Book, id=id)
    book.delete()
    return Response(
        {
            'success': True, 
            'message': 'Book deleted successfully'
        },  
        status=status.HTTP_200_OK,
    )





@api_view(['POST'])
def admin_Change_Password(request):
    username = request.data.get('username')
    current_password = request.data.get('current_password')
    new_password = request.data.get('newPassword')
    confirm_password = request.data.get('confirmPassword')

    # Validate required fields
    if not username or not current_password or not new_password or not confirm_password:
        return Response(
            {
                'success': False,
                'message': 'All fields are required'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check password match
    if new_password != confirm_password:
        return Response(
            {
                'success': False,
                'message': 'New password and confirm password do not match'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check password length
    if len(new_password) < 6:
        return Response(
            {
                'success': False,
                'message': 'New password must be at least 6 characters long'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Authenticate current credentials
    user = authenticate(
        request,
        username=username,
        password=current_password
    )

    if user is None:
        return Response(
            {
                'success': False,
                'message': 'Current password is incorrect'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Optional: Only admin users can change password here
    if not user.is_staff:
        return Response(
            {
                'success': False,
                'message': 'Access denied'
            },
            status=status.HTTP_403_FORBIDDEN
        )

    # Update password
    user.set_password(new_password)
    user.save()

    return Response(
        {
            'success': True,
            'message': 'Password changed successfully'
        },
        status=status.HTTP_200_OK
    )