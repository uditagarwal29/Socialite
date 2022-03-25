const Like = require("../models/like");
const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.toggleLike = async function (req, res) {

    try {
        //route will be likes/toggle/?id=abcde&type=Post
        let likeable, deleted = false;
        //deleted tells if a post is already liked or not
        //if post shows 0 Likes and deleted is false :  Likes increase by  +1
        //if deleted is true(it is true only if likes >0)  --> we remove the like i.e likes-1
        let type = '';

        // get the type of object on which like is placed
        if (req.query.type == 'Post') {
            //pouplating likes in postSchema to know if there are already likes on this post
            likeable = await Post.findById(req.query.id).populate('likes');
            type = 'Post'
        } else {
            //pouplating likes in postSchema to know if there are already likes on this comment
            likeable = await Comment.findById(req.query.id).populate('likes');
            type = 'Comment'
        }
        console.log(req.user)
        console.log(likeable)
        //checking if like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });

        if (existingLike) {
            //if like already exists -> pull it  from like array, and delete existing like
            likeable.likes.pull(existingLike._id);
            likeable.save();
            existingLike.remove();
            deleted = true;
        } else {
            //if like dosent exist already -> put a new like
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            })
            // push the newly created like into the like array
            likeable.likes.push(newLike._id);
            likeable.save();
            // deleted = false;
        }

        return res.json(200, {
            message: "Request successful!",
            data: {
                deleted: deleted
            }
        })

        // return res.json(200 ,  {
        //     deleted : deleted ,
        //     message : "req Successful"
        // })
        return res.redirect('back');

    } catch (error) {

        console.log("Error : ", error);

        return res.json(500, {
            message: "Internal Server Error"
        })
    }
}