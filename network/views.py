import json
from django.core import serializers
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from django.forms import ModelForm
import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from django.views.generic import ListView
from django.db.models import Count

from .models import User, Post, Follower


class CreateNewPost(ModelForm):
    class Meta:
        model = Post
        fields = ['post_content']
        exclude = ['user', 'post_time']


# class PostList(ListView):
#     paginate_by = 10
#     model = Post


def index(request):
    if request.user.is_authenticated:
        user = User.objects.get(username=request.user)
        post = Post.objects.all()
        return render(request, "network/index.html", {
            "post": post,
            "user": user
        })

    # Everyone else is prompted to sign in
    else:
        return HttpResponseRedirect(reverse("login"))


@ csrf_exempt
def new_post(request):
    # Composing a new post must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    post_content = data.get("post_content", "")
    post_time = datetime.datetime.now()

    post = Post(
        user=request.user,
        post_content=post_content,
        post_time=post_time
    )
    post.save()

    return JsonResponse({"message": "Post submitted successfully."}, status=201)


def build_posts(request, post_view):
    # builds posts depending on view (make this a util I think)
    if post_view == "following":
        currently_following = Follower.objects.get(
            main_user=request.user).following.all()
        posts = Post.objects.filter(user__in=currently_following)

    elif post_view == "profile":
        posts = Post.objects.filter(
            user=request.user
        )
        currently_following = Follower.objects.get(
            main_user=request.user).following.all()
        print(len(currently_following))

    else:
        posts = Post.objects.all()

    posts = posts.order_by("-post_time").all()
    return JsonResponse([post.serialize() for post in posts], safe=False)


def profile(request, username):
    if request.user.username == username:

        return render(request, "network/profile.html")


def single_post(request, post_id):
    # Query for requested single post
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)

 # Return Single Post contents
    if request.method == "GET":
        return JsonResponse(post.serialize())

# Provides error if request is not GET
    else:
        return JsonResponse({
            "error": "GET request required"
        }, status=400)


def following_users(request, user_id):

    # displays list of usernames that the user selected is following

    if request.method == "GET":
        following = Follower.objects.filter(pk=user_id)
        return JsonResponse([follower.serialize() for follower in following], safe=False)


def following(request, user_id):
    if user_id == request.user.id:
        currently_following = Follower.objects.get(
            main_user=request.user).following.all()
        posts = Post.objects.filter(user__in=currently_following)

        return JsonResponse([post.serialize() for post in posts], safe=False)


@csrf_exempt
def follow_unfollow(request, user_id, action):
    if request.method == "POST":
        if action == "follow":
            if request.user.username:
                to_follow = User.objects.get(pk=user_id)
                currently_following = Follower.objects.get(
                    main_user_id=request.user)
                if to_follow in currently_following.following.all():
                    return JsonResponse({"error": "Invalid request"}, status=400)
                else:
                    user = User.objects.get(username=request.user)
                    following = Follower()
                    try:
                        currently_following.following.add(to_follow)
                        currently_following.save()
                    except:
                        following.main_user = user
                        following.save()
                        following.following.add(to_follow)
                        following.save()
                        return JsonResponse({"Success": "You are now following this user"}, status=200)
        if action == "unfollow":
            to_follow = User.objects.get(pk=user_id)
            currently_following = Follower.objects.get(
                main_user_id=request.user)
            currently_following.following.remove(to_follow)
            currently_following.save()
            return JsonResponse({"Success": "You are no longer following this user"}, status=200)


@csrf_exempt
def like_post(request, post_id):
    if request.method == "POST":
        if request.user.username:
            liked_post = Post.objects.get(pk=post_id)
            liked_post.likes = liked_post.likes + 1
            liked_post.save()
            return JsonResponse({"Success": "This post has been liked by you"}, status=200)


def other_users_profile(request, user_id):

    # displays posts of any other user selected.
    # TODO: make condition if the user selected is you.
    # TODO: have count of following people.

    if user_id == request.user.id:

        post_view = "profile"

        return build_posts(request, post_view)

    elif user_id != request.user.id:
        posts = Post.objects.filter(
            user=user_id
        )

    else:
        return JsonResponse({"error": "Invalid request"}, status=400)

    posts = posts.order_by("-post_time").all()
    return JsonResponse([post.serialize() for post in posts], safe=False,)


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
