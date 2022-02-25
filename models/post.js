const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, //this ObjectID links post to the user who made that post
        ref: 'User'
    },

    //include the array of ids of all comments in this post schema itself
    //this is much faster than going to each comment and matching it with the current post id
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, {
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;