const User = require('../models/user')
const fs = require('fs') //file system module
const path = require('path')
module.exports.profile = function (req, res) {
    // console.log(req.cookies.codial)
    User.findById(req.params.id, function (err, user) {
        return res.render('user_profile', {
            title: 'Socialite',
            profile_user: user
        })
    })
}

module.exports.update = async function (req, res) {
    if (req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            //multer method uploadedAvatar takes in req and can then access uploaded files data and other form data
            User.uploadedAvatar(req, res, function (err) {
                if (err) {
                    console.log("Multer gave error");
                }
                //updating user with form data
                user.name = req.body.name;
                user.email = req.body.email;
                // console.log(req.file)
                if (req.file) {
                    //EDGE CASE - if user avatar already exist -> delete existing avatarfirst
                    if (user.avatar) {
                        //if the file of that avatar exists
                        if (fs.existsSync(path.join(__dirname, "..", user.avatar))) {
                            //deleting the file (old avatar)  --> unlinkSync = synchronously remove a file
                            fs.unlinkSync(path.join(__dirname, "..", user.avatar));
                        }
                    }
                    //saving the path of the uploaded file in the avatar field of user in the userschema database
                    user.avatar = User.avatarPath + '/' + req.file.filename
                }
                user.save();
                req.flash('success', 'Profile Updated');
                return res.redirect('back');
            })
        } catch (err) {
            req.flash('error', err);
            return res.redirect('back');
        }

    } else {
        req.flash('error', 'Not Authorized')
        return res.status(401).send('Unauthorized')
    }
}

module.exports.signUp = function (req, res) {
    //if user is already logged in redirect them to profile page
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile')
    }

    return res.render('user_sign_up', {
        title: "Socialite | Sign Up"
    })
}

module.exports.signIn = function (req, res) {
    //if user is already logged in redirect them to profile page
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile')
    }
    return res.render('user_sign_in', {
        title: "Socialite | Sign In"
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