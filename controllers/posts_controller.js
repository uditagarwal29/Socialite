const Post = require('../models/post')
const Comment = require('../models/comment')

module.exports.create = function (req, res) {
    Post.create({
        content: req.body.content,
        user: req.user._id
    }, function (err, post) {
        if (err) { console.log('error in creating a post'); return; }
        return res.redirect('back');
    });
}

module.exports.destroy = function (req, res) {
    //first find whether post exists or not by using the post ID in params
    Post.findById(req.params.id, function (err, post) {
        //allow post to be deleted only if post maker and user sending delete post request are same 
        if (post.user == req.user.id) {
            post.remove();
            Comment.deleteMany({ post: req.params.id }, function (err) {
                return res.redirect('back');
            })
        } else {
            return res.redirect('back');
        }
    });
}