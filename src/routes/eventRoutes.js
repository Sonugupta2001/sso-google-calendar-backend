const express = require('express');
const { getEventsController } = require('../controllers/eventController');
const { authenticateGoogleToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/api/getEvents', authenticateGoogleToken, getEventsController);

module.exports = router;