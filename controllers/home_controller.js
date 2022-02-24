// module.exports.home = function (req, res) {
//     return res.end('<h1>Express is up for Codial</h1>')
// }
const Post = require('../models/post')
module.exports.home = function (req, res) {
    // console.log(req.cookies)
    // res.cookie('user_id', 25)
    // Post.find({}, function (err, posts) {
    //     return res.render('home', {
    //         title: "Codeial | Home",
    //         posts: posts
    //     });
    // })
    //populate is used to fetch user details from userSchema using the userID that is stored for a particular post in the postSchema  
    Post.find({}).populate('user').exec(function (err, posts) {
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts
        });
    })
}
