const express = require('express');
const { getProfileController } = require('../controllers/authController');
const { authenticateGoogleToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('api/profileData', authenticateGoogleToken, getProfileController);
module.exports = router;