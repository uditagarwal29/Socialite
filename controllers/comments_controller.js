const Comment = require('../models/comment')
const Post = require('../models/post')

module.exports.create = function (req, res) {
    //req.body.post is POst Id
    Post.findById(req.body.post, function (err, post) {
        //  Comment ID gets stored inside comment array in post while post ID is stored for each comment
        if (post) {
            //.create to insert a new document in comment db
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id,
            }, function (err, comment) {
                //handle error
                //post found-> comment created-> comment pushed to post comments array
                post.comments.push(comment);  //Update function in crud
                post.save(); //to save to db from memory
                res.redirect('/');
            })
        }
    })
}