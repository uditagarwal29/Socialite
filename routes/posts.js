const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts_controller')
const passport = require('passport');

// making  a check if user is logged in then only show create posts option
router.post('/create', passport.checkAuthentication, postsController.create);

//alow deleting post button only when user is logged in
router.get('/destroy/:id', passport.checkAuthentication, postsController.destroy)
module.exports = router;