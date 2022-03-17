const express = require('express'); //shares same express instance as that in main index.js
const router = express.Router();

router.use('/v1', require('./v1'))
router.use('/v2', require('./v2'))

module.exports = router;