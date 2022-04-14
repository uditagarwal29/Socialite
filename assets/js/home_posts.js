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
                    $('#posts-container').prepend(newPost)  // prepend adds at starting of array
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
        return $(`

        <div class="post-div" id="post-<%= post._id%>">

            <div class="pic">
                <img class="profile-pic" src="${post.user.avatar}" alt="Not Found"
                    onerror=this.src="../images/noavatar.png">
            </div>

        <div class="content">
            <div class="tophead">
                <small class="username">
                    ${post.user.name}${post.user.avatar}
                </small>
                <small class="post-date">
                    ${post.createdAt.slice(3,10)}
                </small>

                <a class="delete-post-button" href="/posts/destroy/${post.id}"><img src="../images/delete.png"></a>
         
            </div>

            <div class="text">
                ${post.content}
            </div>

            <div class="interact">
                <small class="like">
                    <a class="toggle-like-button" data-likes="${post.likes.length}" href="/likes/toggle/?id=${post._id}>&type=Post">
                        <span class="like-span">
                            ${post.likes.length} <img src="../images/like.png">
                        </span>
                    </a>
                </small>
            </div>

        </div>
    </div>
        
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