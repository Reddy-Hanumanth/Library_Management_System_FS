from django.urls import path
from django.contrib import admin
from . import views



urlpatterns = [
    path('admin/login/', views.admin_login, name='admin-login'),
    path('categories/add/', views.add_category, name="categories-add"),
    path('categories/', views.Category_list, name="categories"),
    path('categories/update/<int:id>/', views.edit_category, name="categories-edit"),
    path('categories/delete/<int:id>/', views.delete_category, name="categories-delete"),

    path('authors/add/', views.add_author, name="authors-add"),
    path('authors/', views.author_list, name="authors"),
    path('authors/update/<int:id>/', views.edit_author, name="authors-edit"),
    path('authors/delete/<int:id>/', views.delete_author, name="authors-delete"),

    path('books/add/', views.add_Book, name="books-add"),
    path('books/', views.Book_list, name="books"),
    path('books/update/<int:id>/', views.edit_Book, name="books-edit"),
    path('books/delete/<int:id>/', views.delete_Book, name="books-delete"),
]