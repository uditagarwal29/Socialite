const Users = require("../models/user")
const Friendships = require("../models/friendship")

module.exports.addFriend = async function (req, res) {
    let uid = req.user._id
    let fid = req.query.id

    let existingFriendship
    existingFriendship = await Friendships.findOne({
        user_id: uid,
        friend_id: fid
    })

    if(!existingFriendship){
        existingFriendship = await Friendships.findOne({
            user_id: fid,
            friend_id: uid
        })
    }

    let userID = await Users.findById(uid)
    let friendID = await Users.findById(fid)

    // let friendDeleted = false

    if (existingFriendship) {
        userID.friends.pull(existingFriendship._id);
        friendID.friends.pull(existingFriendship._id);
        userID.save()
        friendID.save()
        existingFriendship.remove();
        // friendDeleted = true
    }
    else {
        let newFriendship = await Friendships.create({
            user_id: uid,
            friend_id: fid
        })
        userID.friends.push(newFriendship._id);
        friendID.friends.push(newFriendship._id);
        userID.save()
        friendID.save()
    }

    return res.redirect('back');
}