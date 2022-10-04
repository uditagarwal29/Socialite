const express = require('express'); 
const router = express.Router();
const resetController = require('../controllers/reset_controller')
const passport = require('passport');

router.get('/', resetController.main);
router.post('/verifyEmail', resetController.verifyEmail);
router.get('/reset-password', resetController.resetPassword);
router.post('/change-password', resetController.reset);

module.exports = router;