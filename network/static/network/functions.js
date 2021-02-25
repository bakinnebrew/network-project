document.addEventListener('DOMContentLoaded', function() {
  //collects current user data for nav funnctions
// function user_data(){
//   fetch(`user_data/`)
//   .then(response => response.json())
//   .then(user_data=> {
//           console.log(user_data)
//       });
//     };
  // Use buttons to toggle between views
  document.querySelector('#profile-page').addEventListener('click', () => load_profile('4', 'harry'));
  document.querySelector('#all-posts').addEventListener('click', () => load_posts('all_posts'));
  document.querySelector('#following').addEventListener('click', () => following_posts('1'));
  document.querySelector('#new-post').addEventListener('click', compose_new_post);
  
  load_posts('all_posts');
});

function following_posts(id){
document.querySelector('#posts-view').style.display = 'none';
document.querySelector('#new-post-view').style.display = 'none';
document.querySelector('#profile-view').style.display = 'none';
document.querySelector('#following-view').style.display = 'block';
document.querySelector('#single-post-view').style.display = 'none';

fetch(`/following/${id}`)
  .then(response => response.json())
  .then(posts => {
    console.log(posts);
    posts.forEach(posts => {
    const post_author = document.createElement('div');
    const post_content = document.createElement('div');
    const post_time = document.createElement('div');
    const post_likes = document.createElement('div');
    post_id = posts.id;
    post_author.innerHTML = posts.author;
    post_content.innerHTML = posts.content;
    post_time.innerHTML = posts.timestamp;
    post_likes.innerHTML = posts.likes;
    document.querySelector('#following-view').append(post_author);
    document.querySelector('#following-view').append(post_content);
    document.querySelector('#following-view').append(post_time);
    document.querySelector('#following-view').append(post_likes);
  });

  });
  
};

function view_post(id){
document.querySelector('#posts-view').style.display = 'none';
document.querySelector('#new-post-view').style.display = 'none';
document.querySelector('#profile-view').style.display = 'none';
document.querySelector('#following-view').style.display = 'none';
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

function follow_person(id){
  const following_id = id;
  fetch(`/follow/${id}`, {
    method: 'POST',
    body: JSON.stringify({ 
      user_id: following_id,
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
  document.querySelector('#new-post-view').style.display = 'block';
  document.querySelector('#profile-view').style.display = 'none';
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
document.querySelector('#posts-view').style.display = 'none';
document.querySelector('#new-post-view').style.display = 'none';
document.querySelector('#profile-view').style.display = 'none';
document.querySelector('#single-post-view').style.display = 'none';
document.querySelector('#following-view').style.display = 'none';
document.querySelector('#following-users-view').style.display = 'block';

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
        load_profile(following_names_id, following_names);
      })
    
      document.querySelector('#following-users-view').append(following_name);
        });
      });
    });
}


function load_profile(id, username) {

document.querySelector('#posts-view').style.display = 'none';
document.querySelector('#new-post-view').style.display = 'none';
document.querySelector('#single-post-view').style.display = 'none';
document.querySelector('#profile-view').style.display = 'block';
document.querySelector('#following-view').style.display = 'none';
document.querySelector('#following-users-view').style.display = 'none';

const profile_header = document.createElement('h1');
    profile_header.innerHTML = username;
    document.querySelector('#profile-view').append(profile_header);

fetch(`/profile/${id}`)
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
      document.querySelector('#profile-view').append(post_author);
      document.querySelector('#profile-view').append(post_content);
      document.querySelector('#profile-view').append(post_time);
      document.querySelector('#profile-view').append(post_likes);
      });
    });
    document.querySelector('#follow').addEventListener('click', () => follow_person(author_id));
    document.querySelector('#following-users').addEventListener('click', () => load_following_users(author_id));

};



function load_posts(post_view){

document.querySelector('#posts-view').style.display = 'block';
document.querySelector('#new-post-view').style.display = 'none';
document.querySelector('#profile-view').style.display = 'none';
document.querySelector('#following-view').style.display = 'none';
document.querySelector('#single-post-view').style.display = 'none';

fetch(`/posts/${post_view}`)
     .then(response => response.json())
     .then(posts => { 
       console.log(posts);
     
     posts.forEach(posts => {
         const post_author = document.createElement('div');
         const post_content = document.createElement('div');
         const post_time = document.createElement('div');
         const post_likes = document.createElement('div');
         const post_id = posts.id;
         const post_author_id = posts.author_id;
         const post_author_username = posts.author;
         post_author.innerHTML = posts.author;
         post_likes.innerHTML = `Likes: ${posts.likes}`;
         post_author.addEventListener('click', function() {
          load_profile(post_author_id, post_author_username);
          });
         post_content.innerHTML = posts.content;
         post_content.addEventListener('click', function() {
          view_post(post_id)
         });
         post_time.innerHTML = posts.timestamp;
         
         document.querySelector('#posts-view').append(post_author);
         document.querySelector('#posts-view').append(post_content);
         document.querySelector('#posts-view').append(post_time);
         document.querySelector('#posts-view').append(post_likes);
        
     });
    })
  };


