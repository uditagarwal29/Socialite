const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    //this ObjectID links post to the user who made that post
}, {
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;