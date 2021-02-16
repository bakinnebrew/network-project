document.addEventListener('DOMContentLoaded', function() {
  
  // Use buttons to toggle between views
  document.querySelector('#profile-page').addEventListener('click', () => load_profile);
  document.querySelector('#all-posts').addEventListener('click', () => load_posts('all_posts'));
  document.querySelector('#following').addEventListener('click', () => load_following('2'));
  document.querySelector('#new-post').addEventListener('click', compose_new_post);
  document.querySelector('#create-post-form').addEventListener("submit", submit_post);
  
  load_posts('all_posts');
});

// // function submit_post() {

// // }
function compose_new_post() {

  // Show compose view and hide other views
  document.querySelector('#posts-view').style.display = 'none';
  document.querySelector('#following-view').style.display = 'none';
  document.querySelector('#new-post-view').style.display = 'block';
  document.querySelector('#profile-view').style.display = 'none';
  // Clear out composition fields
  document.querySelector('#compose-body').value = '';
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
  
function load_following(id){
document.querySelector('#posts-view').style.display = 'none';
document.querySelector('#new-post-view').style.display = 'none';
document.querySelector('#profile-view').style.display = 'none';
document.querySelector('#following-view').style.display = 'block';

fetch(`/following/${id}`)
    .then(response => response.json())
    .then(followers=> {
          console.log(followers);

      const follower_name = document.createElement('div');
      follower_name.innerHTML = followers.id
      document.querySelector('#following-view').append(follower_name);
      });

}


function load_profile(id, username) {

document.querySelector('#posts-view').style.display = 'none';
document.querySelector('#new-post-view').style.display = 'none';
document.querySelector('#profile-view').style.display = 'block';
document.querySelector('#following-view').style.display = 'none';

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
      post_author.innerHTML = posts.author;
      post_content.innerHTML = posts.content;
      post_time.innerHTML = posts.timestamp;
      document.querySelector('#profile-view').append(post_author);
      document.querySelector('#profile-view').append(post_content);
      document.querySelector('#profile-view').append(post_time);
      });
    });

};



function load_posts(post_view){

document.querySelector('#posts-view').style.display = 'block';
document.querySelector('#new-post-view').style.display = 'none';
document.querySelector('#profile-view').style.display = 'none';
document.querySelector('#following-view').style.display = 'none';

fetch(`/posts/${post_view}`)
     .then(response => response.json())
     .then(posts => { 
       console.log(posts);
     
     posts.forEach(posts => {
         const post_author = document.createElement('div');
         const post_content = document.createElement('div');
         const post_time = document.createElement('div');
         const post_author_id = posts.author_id
         const post_author_username = posts.author
         post_author.innerHTML = posts.author;
         post_author.addEventListener('click', function() {
          load_profile(post_author_id, post_author_username);
          });
         post_content.innerHTML = posts.content;
         post_time.innerHTML = posts.timestamp;
         
         document.querySelector('#posts-view').append(post_author);
         document.querySelector('#posts-view').append(post_content);
         document.querySelector('#posts-view').append(post_time);
        
     });
    })
  };


