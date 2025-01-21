const express = require('express');
const { extractTokens } = require('../controllers/tokenController');
const router = express.Router();

router.get('/getTokens', extractTokens);
module.exports = router;