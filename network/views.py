import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from django.forms import ModelForm
import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from django.forms.models import model_to_dict


from .models import User, Post, Follower


class CreateNewPost(ModelForm):
    class Meta:
        model = Post
        fields = ['post_content']
        exclude = ['user', 'post_time']


def index(request):
    if request.user.is_authenticated:
        return render(request, "network/main_page.html")

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

    # if request.method == "POST":
    #     user = User.objects.get(username=request.user)
    #     form = CreateNewPost(request.POST, request.FILES)
    #     if form.is_valid:
    #         post = form.save(commit=False)
    #         post.user = user
    #         post.post_time = datetime.datetime.now()
    #         post.save()
    #     return redirect('index')
    # else:
    #     return render(request, "network/post.html", {
    #         "form": CreateNewPost()
    #     })


# def profile(request, username):
#     if username == request.user:
#         user = Post.objects.filter(
#             user=request.user
#         )
#         return JsonResponse([post.serialize() for post in posts], safe=False)
#     else:
#         return JsonResponse({"error": "Invalid request"}, status=400)


def posts(request, post_view):
    if post_view == "all_posts":
        posts = Post.objects.all()

    elif post_view == "profile":
        posts = Post.objects.filter(
            user=request.user
        )
    else:
        return JsonResponse({"error": "Invalid request"}, status=400)

    posts = posts.order_by("-post_time").all()
    return JsonResponse([post.serialize() for post in posts], safe=False)


def following(request, user_id):
    if user_id == request.user.id:
        followers = Follower.objects.filter(
            main_user=request.user
        )
    else:
        return JsonResponse({"error": "Invalid request"}, status=400)

    data = serializers.serialize('json', followers)
    return JsonResponse(data, content_type='application/json', safe=False)


def profile(request, user_id):
    if user_id == request.user.id:
        posts = Post.objects.filter(
            user=request.user
        )

    elif user_id != request.user.id:
        posts = Post.objects.filter(
            user=user_id
        )
    else:
        return JsonResponse({"error": "Invalid request"}, status=400)

    posts = posts.order_by("-post_time").all()
    return JsonResponse([post.serialize() for post in posts], safe=False)


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
