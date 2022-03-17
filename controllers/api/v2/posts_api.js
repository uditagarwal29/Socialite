const Post = require('../../../models/post')
const Comment = require('../../../models/comment')

module.exports.index = async function (req, res) {
    let posts = await Post.find({})
        .sort('-createdAt')  // sorts posts by latest on top and oldest at bottom
        .populate('user', '-password') //excluding password from api's json response
        .populate({
            path: 'comments',
            //further populating comments path to get user who made the comment
            populate: {
                path: 'user',
                select: { 'password': 0 } //exlcude password from comments array
            },
            options: { sort: { 'createdAt': -1 } } // sort comments by latest
        })
    return res.json(200, {
        message: "All Posts : ",
        posts: posts
    })
};

module.exports.destroy = async function (req, res) {

    try {
        let post = await Post.findById(req.params.id)
        // if (post.user == req.user.id) {
        post.remove();
        await Comment.deleteMany({ post: req.params.id });
        return res.json(200, {
            message: "Post deleted"
        });
        // } else {
        //     return res.redirect('back');
        // }
    } catch (err) {
        return res.json(500, {
            message: "Server Error"
        });
    }
}