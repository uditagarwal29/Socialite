const User = require('../models/user')

module.exports.profile = function (req, res) {
    return res.render('users', { username: "Udit" })
}

module.exports.signUp = function (req, res) {
    return res.render('user_sign_up', {
        title: "Codial | Sign Up"
    })
}

module.exports.signIn = function (req, res) {
    return res.render('user_sign_in', {
        title: "Codial | Sign In"
    })
}

//get sign up data
module.exports.create = function (req, res) {
    //if password != confirm password, go back
    if (req.body.password != req.body.confirm_password) {
        console.log("confirm pasword != password")
        return res.redirect('back');
    }

    //if entered user email already exists
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            console.log("error in finding user");
            return;
        }
        //if user dosent exist already -> create user
        if (!user) {
            User.create(req.body, function (err, user) {
                if (err) {
                    console.log("Error in creating user");
                    return;
                }
                //if user created redirect them to sign in page
                return res.redirect('/users/sign-in');
            })
        } else {
            //if user already present redirect them to sign in page
            console.log("user already present")
            return res.redirect('back');
        }
    })
}

module.exports.createSession = function (req, res) {
    //TODO
}