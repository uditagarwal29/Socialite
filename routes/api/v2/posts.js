const express = require('express'); //shares same express instance as that in main index.js
const router = express.Router();
const postsApi = require('../../../controllers/api/v2/posts_api')

router.get('/', postsApi.index);

module.exports = router;