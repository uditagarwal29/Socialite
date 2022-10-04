const express = require('express'); //shares same express instance as that in main index.js
const router = express.Router();
const homeController = require('../controllers/home_controller')

//Requests for home page('/') is controller by home_controller
router.get('/', homeController.home)

//requests related to user is  redirected to users router
router.use('/users', require('./users'))
router.use('/posts', require('./posts'))
router.use('/comments', require('./comments'))
router.use('/reset', require('./reset'))
router.use('/friends',require('./friends'))

//Change
router.use('/likes', require('./likes'))

router.use('/api', require('./api'))

module.exports = router;