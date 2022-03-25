const express = require('express');
const router = express.Router();
const likesController=require('../controllers/likes_controller');

// making  a check if user is logged in then only show create posts option
router.post('/toggle',likesController.toggleLike);

module.exports = router;