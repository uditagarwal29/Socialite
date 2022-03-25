{
    //method to submit form data using ajax
    let createPost = function () {
        let newPostForm = $('#new-post-form'); //get the new post form from home.ejs
        newPostForm.submit(function (e) {
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/posts/create',  //where to submit form
                data: newPostForm.serialize(), //this converts post data into json format
                success: function (data) {
                    // console.log(data.data.post.user.name)
                    let newPost = newPostDom(data.data.post)
                    $('#posts-container>ul').prepend(newPost)  // prepend adds at starting of array
                    //passing a tag class to the dletepost method defined below
                    deletePost($('.delete-post-button', newPost)); //newPost has .delete-psot-button class inside it

                    //CHANGE
                    //from toggle_likes.js , creating new instance of ToggleLike class
                    new ToggleLike($('.toggle-like-button', newPost));
                    
                    new Noty({
                        theme: 'relax',
                        text: "Post Created!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();

                }, error: function (error) {
                    console.log(error.responseText);
                }
            });
        });
    }

    //method to create a post in DOM
    let newPostDom = function (post) {
        return $(`<li id="post-${post._id}">
        <p>
                <small>
                    <a class="delete-post-button" href="/posts/destroy/${post._id}">x</a>
                </small>
                
                    ${post.content}
                        <br>
                        <small>
                            ${post.user.name}
                        </small>
                        <br>
                        <small>
                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                    0 Likes
                </a>
            </small>
        </p>
        <div class="post-comments">
            <!-- this if condition allows to show options such as comments delete post only if user is logged in -->
     
                <form action="/comments/create" method="POST">
                    <input type="text" name="content" placeholder="Type here to add comment..." required>
                    <!-- // we need to send the id of the post to which we need to add comment to  -->
                    <input type="hidden" name="post" value="${post._id}">
                    <input type="submit" value="Add Comment">
                </form>

                    <div class="post-comments-list">
                        <ul id="post-comments-${post._id}">
                            
                        </ul>
                    </div>
        </div>
    </li>
        
        `)
    }

    //method to delete post
    //we pass on the a tag of delete buttom with class "delete-post-button" in _post.ejs


    //this functions sends in delete request
    let deletePost = function (deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),  // to get href value
                success: function (data) {
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();
                }, error: function (error) {
                    console.log(error.responseText);
                }
            })
        })
    }

    createPost();
}