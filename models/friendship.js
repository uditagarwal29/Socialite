const mongoose = require("mongoose")

const friendshipSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    friend_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Friendships = mongoose.model('Friendships', friendshipSchema)
module.exports = Friendships