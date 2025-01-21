const express = require('express');
const { getEventsController } = require('../controllers/eventController');
const { authenticateGoogleCode } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/getEvents', authenticateGoogleCode, getEventsController);
module.exports = router;