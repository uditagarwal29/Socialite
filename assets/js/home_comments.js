let createComments = function () {
    let newCommentForm = $('#new-comment-form');
    newCommentForm.submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/comments/create',
            data: newCommentForm.serialize(),
            success: function (data) {
                // console.log(data);
                let newComment = newCommentDom(data.data.comment);
                //  console.log(data.data.comment)
                $('#post-comments-' + data.data.comment.post).prepend(newComment);
                deleteComment($(' .delete-comment-button', newComment));

                //CHANGE
                //from toggle_likes.js , creating new instance of ToggleLike class
                new ToggleLike($('.toggle-like-button',newComment));

                new Noty({
                    theme: 'relax',
                    text: "Comment created!",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                }).show();
            },
            error: function (error) {
                console.log(error.responseText);
            }
        })
    })
}

let newCommentDom = function (comment) {
    //console.log(comment.content);
    return $(`  
    <li id="comment-${comment._id}">
        <p class="comment-user-info">
            ${comment.user.name} 
        </p>
        <p class="comment-content">
            <div class="content">
                ${comment.content} 
            </div>
            <div class="delete-button">
                    <a class="delete-comment-button" href="/comments/destroy/${comment._id}">x</a>
            </div>
            <small>
                            
                                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
                                    0 Likes
                                </a>
                            
                            </small>
        </p>
    </li>
   `);
}

let deleteComment = function (deleteLink) {
    $(deleteLink).click(function (e) {
        e.preventDefault();
        $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),
            success: function (data) {
                // console.log(`#comment-${data.data.comment_id}`)
                // console.log(data);
                $(`#comment-${data.data.comment_id}`).remove();
                new Noty({
                    theme: 'relax',
                    text: "comment deleted!",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500

                }).show();
                console.log("jiiii");

            },
            error: function (error) {
                console.log(error.responseText);
            }
        });
    });
}

createComments();