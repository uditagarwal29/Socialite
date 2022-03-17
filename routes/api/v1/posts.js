const express = require('express'); //shares same express instance as that in main index.js
const router = express.Router();
const postsApi = require('../../../controllers/api/v1/posts_api')

router.get('/', postsApi.index);
router.delete('/:id', postsApi.destroy);

module.exports = router;