const express = require('express'); //shares same express instance as that in main index.js
const router = express.Router();
const usersController = require('../controllers/users_controller')
const passport = require('passport');

//for users request like profile, feed etc we use users_controller
//passing checkauthentication as middleware so that profile page is accessible only when user is logged in
router.get('/profile', passport.checkAuthentication, usersController.profile)
// router.get('/post', postsController.posts)

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);
router.post('/create', usersController.create);

//use passport as middleware for authentication
//post request sent to sign in create session route, passport authenticates user, 
router.post('/create-session', passport.authenticate(
    'local',
    { failureRedirect: '/users/sign-in' }, // if password wrong -> go to sign in again
), usersController.createSession)

router.get('/sign-out', usersController.destroySession)

module.exports = router;