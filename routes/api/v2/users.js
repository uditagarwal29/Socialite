const express = require('express'); //shares same express instance as that in main index.js
const router = express.Router();
const usersApi = require('../../../controllers/api/v2/users_api')

router.post('/create-session', usersApi.createSession);

module.exports = router;