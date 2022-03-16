const Post = require('../models/post')
const Comment = require('../models/comment')

module.exports.create = async function (req, res) {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        //detect if request is an ajax request which is xhr request
        if (req.xhr) {
            post = await post.populate('user', 'name');
            // req.flash('success', 'Post created ')
            return res.status(200).json({
                data: {
                    post: post
                }, message: "Post created"
            });
        }
        req.flash('success', 'Post created ')
        return res.redirect('back');
    } catch (err) {
        req.flash('error', err)
        console.log('Error', err)
        return res.redirect('back');
    }
}

module.exports.destroy = async function (req, res) {
    //first find whether post exists or not by using the post ID in params
    try {
        let post = await Post.findById(req.params.id)
        //allow post to be deleted only if post maker and user sending delete post request are same 
        if (post.user == req.user.id) {
            post.remove();
            await Comment.deleteMany({ post: req.params.id });

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                })
            }

            req.flash('success', 'Post deleted')
            return res.redirect('back');
        } else {
            req.flash('success', 'Not authorized to do this')
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', err)
        console.log('Error', err);
        return;
    }
}