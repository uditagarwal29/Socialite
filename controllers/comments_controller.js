const Comment = require('../models/comment')
const Post = require('../models/post')
const commentsMailer = require('../mailers/comments_mailer')
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker')

//CHANGE
const Like = require('../models/like')

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

            comment = await comment.populate('user', 'name email');  //populating name and email of maker of the comment
            //whenever a new comment is created we pass it to the mailer so that it can send the email update to the comment maker
            // commentsMailer.newComment(comment);
            let job = queue.create('emails', comment).save(function (err) {
                if (err) {
                    console.log('Error in creating queue : ', err);
                    return;
                }
                // console.log('Job queued', job.id);
            })
            if (req.xhr) {

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
        if ((comment.user == req.user.id) || (comment.post.user == req.user.id)) {
            //saving postId of comment to remove it from comments array in post
            let postId = comment.post;
            comment.remove();
            let post = Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } })

    
            //deleting likes of comments of the post
            await Like.deleteMany({ likeable: comment._id, onModel: 'Comment' });

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