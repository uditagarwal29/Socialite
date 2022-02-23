// module.exports.home = function (req, res) {
//     return res.end('<h1>Express is up for Codial</h1>')
// }

module.exports.home = function (req, res) {
    console.log(req.cookies)
    res.cookie('user_id', 25)
    return res.render('home',{ title: "Home"});
}
