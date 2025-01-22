const express = require('express');
const { getEventsController } = require('../controllers/getEventsController');
const { extractTokens } = require('../middlewares/extractTokens');
const { refreshTokens } = require('../middlewares/refreshTokens');
const router = express.Router();

router.post('/login', extractTokens, (req, res) => {
    req.session.tokens = req.tokens;
    res.status(200).json({ success: true, message: 'Login successful' });
});

router.get('/getEvents', refreshTokens, getEventsController);
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({ success: true, message: 'Logout successful' });
});


module.exports = router;