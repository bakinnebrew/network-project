
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("new_post", views.new_post, name="new_post"),

    # API routes
    path("posts/<str:post_view>", views.posts, name="posts"),
    path("profile/<int:user_id>", views.profile, name="profile"),
    path("following_users/<int:user_id>", views.following, name="following"),
    path("follow/<int:user_id>", views.follow, name="follow"),
    path("single_post/<int:post_id>", views.single_post, name="single_post"),
    path("like_post/<int:post_id>", views.like_post, name="load_post")
    # path("user_data", views.user_data, name="user_data")
]
