const Post = require('../models/post')
const Comment = require('../models/comment')

module.exports.create = async function (req, res) {
    try {
        await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        return res.redirect('back');
    } catch (err) {
        console.log('Error', err)
        return;
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
            return res.redirect('back');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.log('Error', err);
        return;
    }
}