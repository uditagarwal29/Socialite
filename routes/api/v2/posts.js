const express = require('express'); //shares same express instance as that in main index.js
const router = express.Router();
const passport = require('passport');
const postsApi = require('../../../controllers/api/v2/posts_api')

router.get('/', postsApi.index);
router.delete('/:id', passport.authenticate('jwt', {session: false}) , postsApi.destroy);

module.exports = router;