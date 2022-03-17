const express = require('express'); //shares same express instance as that in main index.js
const router = express.Router();

router.use('/posts', require('./posts'))
router.use('/users', require('./users'))

module.exports = router;