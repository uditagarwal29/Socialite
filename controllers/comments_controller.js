const Comment = require('../models/comment')
const Post = require('../models/post')

module.exports.create = async function (req, res) {
    //req.body.post is POst Id
    try {
        let post = await Post.findById(req.body.post);
        //  Comment ID gets stored inside comment array in post while post ID is stored for each comment
        if (post) {
            //.create to insert a new document in comment db
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id,
            });
            //post found-> comment created-> comment pushed to post comments array
            post.comments.push(comment);  //Update function in crud
            post.save(); //to save to db from memory

            if (req.xhr) {
                comment = await comment.populate('user', 'name');
                // Similar for comments to fetch the user's id!
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment created!"
                });
            }

            req.flash('success', 'Comment created')
            res.redirect('/');
        }
    } catch (err) {
        req.flash('error', err)
        console.log('Error', err);
        return;
    }
}

module.exports.destroy = async function (req, res) {
    try {
        let comment = await Comment.findById(req.params.id);
        //verifying if this comment was made by the logged in user
        if ((comment.user = req.user.id) || (comment.post.user == req.user.id)) {
            //saving postId of comment to remove it from comments array in post
            let postId = comment.post;
            comment.remove();
            let post = Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } })

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: 'Comment Deleted!'

                });

            }
            req.flash('success', 'Comment deleted')
            return res.redirect('back')
        } else {
            req.flash('success', 'Not authorized to do this')
            return res.redirect('back');
        }
    }
    catch (err) {
        req.flash('error', err)
        console.log('Error', err);
        return;
    }

}