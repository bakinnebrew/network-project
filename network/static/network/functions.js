document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#profile-page').addEventListener('click', () => load_posts('profile'));
  document.querySelector('#all-posts').addEventListener('click', () => load_posts('all_posts'));
  document.querySelector('#new-post').addEventListener('click', compose_new_post);
  document.querySelector('#create-post-form').addEventListener("submit", submit_post);
  
  load_posts('all_posts');
});

// // function submit_post() {

// // }
function compose_new_post() {

  // Show compose view and hide other views
  document.querySelector('#posts-view').style.display = 'none';
  document.querySelector('#profile-view').style.display = 'none';
  document.querySelector('#new-post-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-body').value = '';
};

function submit_post(){
  const post_content = document.querySelector("#compose-body").value;
  fetch('/new_post', {
    method: 'POST',
    body: JSON.stringify({
        post_content: post_content
    })
  })
  .then(response => response.json())
  .then(result => {
        console.log(result);
        return false;
      });
  };

function load_profile(id) {

document.querySelector('#profile-view').innerHTML = `<h3>${id.charAt(0).toUpperCase() + id.slice(1)}</h3>`;

document.querySelector('#profile-view').style.display = 'block';
document.querySelector('#posts-view').style.display = 'none';
document.querySelector('#new-post-view').style.display = 'none';


fetch(`/profile/${id}`)
    .then(response => response.json())
    .then(profile => {
          console.log(profile);
      const profile_owner = profile.user.id
      const profile_owner = document.createElement('h1');
      profile_owner.innerHTML = profile_owner_id;
         document.querySelector('#profile-view').append(profile_owner);

     });

//  load_posts('profile');
};



function load_posts(post_view){

fetch(`/posts/${post_view}`)
     .then(response => response.json())
     .then(posts => { 
       console.log(posts);
     
     posts.forEach(posts => {
         const post_author = document.createElement('div');
         const post_content = document.createElement('div');
         const post_time = document.createElement('div');
         const post_user = posts.user.id
         post_author.innerHTML = posts.author;
         post_author.addEventListener('click', function() {
          load_profile(post_user);
          });
         post_content.innerHTML = posts.content;
         post_time.innerHTML = posts.timestamp;

        if (post_view == 'profile')
            {
         document.querySelector('#profile-view').append(post_author);
         document.querySelector('#profile-view').append(post_content);
         document.querySelector('#profile-view').append(post_time);
            }
        else {
         document.querySelector('#posts-view').append(post_author);
         document.querySelector('#posts-view').append(post_content);
         document.querySelector('#posts-view').append(post_time);
        }
     });
    })
  };


