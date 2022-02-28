const User = require('../models/user')

module.exports.profile = function (req, res) {
    // console.log(req.cookies.codial)
    User.findById(req.params.id, function (err, user) {
        return res.render('user_profile', {
            title: 'Codial',
            profile_user: user
        })
    })
}

module.exports.update = function (req, res) {
    if (req.user.id == req.params.id) {
        User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
            return res.redirect('back');
        })
    } else {
        return res.status(401).send('Unauthorized')
    }
}

module.exports.signUp = function (req, res) {
    //if user is already logged in redirect them to profile page
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile')
    }

    return res.render('user_sign_up', {
        title: "Codial | Sign Up"
    })
}

module.exports.signIn = function (req, res) {
    //if user is already logged in redirect them to profile page
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile')
    }
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

//sign in user and create a session for the user
module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in Successfully')
    return res.redirect('/');
}

module.exports.destroySession = function (req, res) {
    req.logout();
    req.flash('success', 'Logged out!')
    return res.redirect('/');
}