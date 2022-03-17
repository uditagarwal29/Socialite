const passport = require('passport');
const { ExtractJwt } = require('passport-jwt');
const JWTstrategy = require('passport-jwt').Strategy; //to use passport JWT strategy
const ExtractJWT = require('passport-jwt').ExtractJwt;  //to allow us to extract JWT from header
const User = require('../models/user'); // since we need user for authentication

//key to encrypt JWT 
let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'codeial'
}

passport.use(new JWTstrategy(opts, function (jwtPayLoad, done) {
    User.findById(jwtPayLoad._id, function (err, user) {
        if (err) {
            console.log('Error in finding user from JWT');
            return;
        }
        //matching JWT Token
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    })
}));

module.exports = passport;