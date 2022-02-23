const express = require('express'); //shares same express instance as that in main index.js
const router = express.Router();
const usersController = require('../controllers/users_controller')
// const postsController = require('../controllers/posts_controller')

//for users request like profile, feed etc we use users_controller
router.get('/profile', usersController.profile)
// router.get('/post', postsController.posts)

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);
router.post('/create', usersController.create);

module.exports = router;