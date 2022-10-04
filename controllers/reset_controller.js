const AccessToken = require('../models/accessToken');
const User = require('../models/user');
const crypto = require('crypto');
const resetpasswordMailer = require('../mailers/changepassword_mailer')

module.exports.main = async function (req, res) {
    return res.render('confirmEmail', {
        title: "Socialite | Confirm Email",
    });
}
module.exports.verifyEmail = async function (req, res) {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        req.flash("error", "User with this email dosen't exist");
        return res.redirect('back');
    }
    else {
        let accessToken = await crypto.randomBytes(20).toString('hex');
        let token = await AccessToken.create({
            token: accessToken,
            user: user,
            isValid: true
        })
        // console.log('Reset Password Link Sent')
        token = await token.populate('user', 'name email')
        resetpasswordMailer.resetPasswordMail(token);
        return res.render('emailVerified', {
            title: "Socialite | Check Inbox",
        })
       
    }
}

module.exports.resetPassword = async function(req , res){

    let accessToken = await AccessToken.findOne({token : req.query.accessToken});

    if(accessToken){
        if(accessToken.isValid){
            return res.render('resetPassword' , {
                title : 'Socialite | Reset Password',
                accessToken : accessToken.token
            })
        }
    }

    req.flash('error' , 'Token is Expired ! Pls regenerate it.');
    return res.redirect('/reset');
}

module.exports.reset = async function(req, res){

    let token = await AccessToken.findOne({token: req.query.accessToken});
    if(token){
        if(token.isValid){
            token.isValid = false;
            if(req.body.password == req.body.confirmpassword){
                let user = await User.findById(token.user)
                if(user){
                    user.password = req.body.password;
                    user.save();
                    token.save();
                    req.flash('success', 'Password Changed!');
                    return res.redirect('/users/sign-in');
                }
            }
            else{
                req.flash('error','Password dosent match');
                return res.redirect('back')
            }
        }

        request.flash('error' , 'Token Expired');
        return response.redirect('/reset');
    }
    



    request.flash('error' , 'Token is Expired ! Pls regenerate it.');
    return response.redirect('/reset');
}