window.onpopstate = function(event) {
  console.log(event.state.page)
  build_posts(event.state.page)
}

//  //logic that constructs URL based on buttojn click and data-name attribute
//  document.addEventListener('DOMContentLoaded', function() {
//   document.querySelector('button').forEach(button => {
//     button.onclick = function() {
//       const page = this.dataset.page;
//       const name = this.dataset.name;
//       history.pushState({page: page, name: name}, "",`${page}/${name}`);
//     }
//   });
// });

document.addEventListener('DOMContentLoaded', function() {

  document.querySelector('#profile-page').addEventListener('click', () => build_posts('profile'));
  document.querySelector('#all-posts').addEventListener('click', () => build_posts('all_posts'));
  document.querySelector('#following').addEventListener('click', () => build_posts('following'));
  document.querySelector('#new-post').addEventListener('click', compose_new_post);
  
  build_posts('all_posts');
});


function view_post(id){
document.querySelector('#posts-view').style.display = 'none';
document.querySelector('#new-post-view').style.display = 'none';
document.querySelector('#following-view').style.display = 'none';
document.querySelector('#other-users-profile-view').style.display = 'none';
document.querySelector('#single-post-view').style.display = 'block';

fetch(`/single_post/${id}`)
  .then(response => response.json())
  .then(post => {
    console.log(post);
    const post_author = document.createElement('div');
    const post_content = document.createElement('div');
    const post_time = document.createElement('div');
    const post_likes = document.createElement('div');
    post_id = post.id;
    post_author.innerHTML = post.author;
    post_content.innerHTML = post.content;
    post_time.innerHTML = post.timestamp;
    post_likes.innerHTML = post.likes;
    document.querySelector('#single-post-view').append(post_author);
    document.querySelector('#single-post-view').append(post_content);
    document.querySelector('#single-post-view').append(post_time);
    document.querySelector('#single-post-view').append(post_likes);
});
  document.querySelector('#like').addEventListener('click', () => like_post(post_id));
};

function follow_unfollow_person(id, follow_or_unfollow){
  const following_id = id;
  const action = follow_or_unfollow;
  fetch(`/follow_unfollow/${id}/${follow_or_unfollow}`, {
    method: 'POST',
    body: JSON.stringify({ 
      user_id: following_id,
      action: action,
    })   
  });
};

function like_post(id){
  const post_id = id;
  fetch(`/like_post/${id}`, {
    method: 'POST',
    body: JSON.stringify({
      post_id: post_id,
    })
  })
};

function compose_new_post() {

  // Show compose view and hide other views
  document.querySelector('#posts-view').style.display = 'none';
  document.querySelector('#following-view').style.display = 'none';
  document.querySelector('#following-users-view').style.display = 'none';
  document.querySelector('#new-post-view').style.display = 'block';
  document.querySelector('#other-users-profile-view').style.display = 'none';
  document.querySelector('#single-post-view').style.display = 'none';
  // Clear out composition fields
  document.querySelector('#compose-body').value = '';
  document.querySelector('#create-post-form').addEventListener("submit", submit_post);
};

function submit_post(){
  const post_content = document.querySelector("#compose-body").value;
  fetch('/new_post', {
    method: 'POST',
    body: JSON.stringify({
        post_content: post_content,
    })
  })
  .then(response => response.json())
  .then(result => {
        console.log(result);
      });
  };
  
function load_following_users(id){
document.querySelector('#following-users-view').style.display = 'block';
document.querySelector('#posts-view').style.display = 'none';
document.querySelector('#new-post-view').style.display = 'none';
document.querySelector('#single-post-view').style.display = 'none';
document.querySelector('#following-view').style.display = 'none';
document.querySelector('#other-users-profile-view').style.display = 'none';


fetch(`/following_users/${id}`)
    .then(response => response.json())
    .then(following=> {
        console.log(following);
    
    if(following == 0 ){
      const load_following_error = document.createElement('div');
      load_following_error.innerHTML = "You are not following anyone";
      document.querySelector('#following-users-view').append(load_following_error);

    }
//loops through JSON object array "following", displaying each person the user is following. 
      following.forEach(following => {
        const following_names = following.following;
        following_names.forEach(following_names => {
        const following_name = document.createElement('div');
        following_name.innerHTML = following_names;
        following_name.addEventListener('click', function() {
          load_following_user_profile(following_names_id, following_names);
        })
      
        document.querySelector('#following-users-view').append(following_name);
          });
        });
      });
}


function load_other_user_profile(id, username) { 

document.querySelector('#posts-view').style.display = 'none';
document.querySelector('#new-post-view').style.display = 'none';
document.querySelector('#single-post-view').style.display = 'none';
document.querySelector('#following-view').style.display = 'none';
document.querySelector('#following-users-view').style.display = 'none';
document.querySelector('#other-users-profile-view').style.display = 'block';

const profile_header = document.createElement('h1');
profile_header.innerHTML = username.innerHTML;
document.querySelector('#other-users-profile-view').append(profile_header);



fetch(`/other_users_profile/${id}`)
    .then(response => response.json())
    .then(posts=> {
          console.log(posts);

    posts.forEach(posts => {
      const post_author = document.createElement('div');
      const post_content = document.createElement('div');
      const post_time = document.createElement('div');
      const post_likes = document.createElement('div');
      post_author.innerHTML = posts.author;
      author_id = posts.author_id;
      post_content.innerHTML = posts.content;
      post_id = posts.id;
      post_content.addEventListener('click', function() {
        view_post(posts.id)
      })
      post_time.innerHTML = posts.timestamp;
      post_likes.innerHTML = posts.likes;
      document.querySelector('#other-users-profile-view').append(post_author);
      document.querySelector('#other-users-profile-view').append(post_content);
      document.querySelector('#other-users-profile-view').append(post_time);
      document.querySelector('#other-users-profile-view').append(post_likes);
      });
    });
    document.querySelector('#follow').addEventListener('click', () => follow_unfollow_person(author_id, 'follow'));
    document.querySelector('#unfollow').addEventListener('click', () => follow_unfollow_person(author_id, 'unfollow'));
    document.querySelector('#following-users').addEventListener("submit", () => load_following_users(author_id));

};




function build_posts(post_view){
  
  fetch(`/build_posts/${post_view}`)
    .then(response => response.json())
    .then(posts => {
      console.log(posts);

      posts.forEach(posts=> {
         const post_author_username = document.createElement('div');
         const post_content = document.createElement('div');
         const post_time = document.createElement('div');
         const post_likes = document.createElement('div');
         const post_id = posts.id;
         post_author_username.innerHTML = posts.author;
         const post_author_id = posts.author_id;
         post_likes.innerHTML = `Likes: ${posts.likes}`;
         post_author_username.addEventListener('click', function() {
          load_other_user_profile(post_author_id, post_author_username);
          });
         post_content.innerHTML = posts.content;
         post_content.addEventListener('click', function() {
          view_post(post_id)
         });
         post_time.innerHTML = posts.timestamp;
      
      if(post_view == "following"){
        document.querySelector('#posts-view').style.display = 'none';
        document.querySelector('#new-post-view').style.display = 'none';
        document.querySelector('#following-view').style.display = 'block';
        document.querySelector('#single-post-view').style.display = 'none';
        document.querySelector('#following-users-view').style.display = 'none';
        document.querySelector('#profile-view').style.display = 'none';

        document.querySelector('#other-users-profile-view').style.display = 'none';
        document.querySelector('#following-view').append(post_author_username);
        document.querySelector('#following-view').append(post_content);
        document.querySelector('#following-view').append(post_time);
        document.querySelector('#following-view').append(post_likes);
      }
      else if(post_view == "profile"){

        document.querySelector('#posts-view').style.display = 'none';
        document.querySelector('#follow-button-view').style.display = 'none';
        document.querySelector('#new-post-view').style.display = 'none';
        document.querySelector('#single-post-view').style.display = 'none';
        document.querySelector('#profile-view').style.display = 'block';
        document.querySelector('#other-users-profile-view').style.display = 'none';
        document.querySelector('#following-view').style.display = 'none';
        document.querySelector('#following-users-view').style.display = 'none';

        document.querySelector('#profile-header').innerHTML = (post_author_username).innerHTML;
        document.querySelector('#profile-view').append(post_author_username);
        document.querySelector('#profile-view').append(post_content);
        document.querySelector('#profile-view').append(post_time);
        document.querySelector('#profile-view').append(post_likes);

      }
      else {
        document.querySelector('#other-users-profile-view').style.display = 'none';
        document.querySelector('#posts-view').style.display = 'block';
        document.querySelector('#new-post-view').style.display = 'none';
        document.querySelector('#following-view').style.display = 'none';
        document.querySelector('#single-post-view').style.display = 'none';
        document.querySelector('#profile-view').style.display = 'none';
        document.querySelector('#posts-view').append(post_author_username);
        document.querySelector('#posts-view').append(post_content);
        document.querySelector('#posts-view').append(post_time);
        document.querySelector('#posts-view').append(post_likes);
      }
    });
  });
}
