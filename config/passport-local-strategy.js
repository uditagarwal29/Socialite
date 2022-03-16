const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user')

// authentication using passport.js
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true //allows us to set first argument as req.it allows us to poss more than just email and password to local strategy
},
    //callback function ->  
    function (req, email, password, done) {
        //find a user and establish identity
        User.findOne({ email: email }, function (err, user) {
            if (err) {
                // console.log("Error in findind user");
                req.flash('error', err)
                return done(err);
            }

            //if user not found or invalid password
            if (!user || user.password != password) {
                // console.log("Invalid username/password");
                req.flash('error', 'Invalid Username/Password')
                return done(null, false); //here error is null and authetication is not done so returning false to done.
            }
    
            //if user found
            return done(null, user);
        });
    }
));

// serializing the user to decide which key is to be kept in the cookies
//SERIALIZING ---> user signed up -> find user id -> send it to cookie -> encrypted -> cookie sent to browser
passport.serializeUser(function (user, done) {
    done(null, user.id);  //sets user id to cookie in encrypted format
})

//deserialising the user from the key in the cookies
//DESERIALIZING ---> browser makes a request to cookie to fetch user data
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        if (err) {
            console.log("Error in finding user");
            return (done(err));
        }
        return done(null, user);
    })
})

//check if the user is authenticated
//middleware
passport.checkAuthentication = function (req, res, next) {
    if (req.isAuthenticated()) {
        //detects if user is signed in  -> pass them to next function (controller's action)
        return next();
    }
    //if user not signed in
    return res.redirect('/users/sign-in')
}

passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        //req.user contains the current signed in user form the session cookie and we are sending this to the locals for the
        //views
        res.locals.user = req.user;
    }
    next(); //to prevent getting stuck
}

module.exports = passport;