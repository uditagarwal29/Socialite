// module.exports.home = function (req, res) {
//     return res.end('<h1>Express is up for Codial</h1>')
// }
const Post = require('../models/post')
const User = require('../models/user')
module.exports.home = async function (req, res) {
    // console.log(req.cookies)
    // res.cookie('user_id', 25)
    // Post.find({}, function (err, posts) {
    //     return res.render('home', {
    //         title: "Codeial | Home",
    //         posts: posts
    //     });
    // })
    //populate is used to fetch user details from userSchema using the userID that is stored for a particular post in the postSchema  
    try {
        let posts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                //further populating comments path to get user who made the comment
                populate: {
                    path: 'user'
                }
            })

        let users = await User.find({})
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            all_users: users
        });

    } catch (err) {
        console.log('Error', err);
        return;
    }
}
