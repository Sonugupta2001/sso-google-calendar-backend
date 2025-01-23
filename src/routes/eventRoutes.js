const express = require('express');
const { getEventsController } = require('../controllers/getEventsController');
const { extractTokens } = require('../middlewares/extractTokens');
const { refreshTokens } = require('../middlewares/refreshTokens');
const router = express.Router();

/* --------------------------------------------------------------------------------------------------------------------
    [login route]- the first route where the frontend request will come to after the google-login
    In this route, first we will extract the tokens (access token, refresh token) from the authorisation code sent from the frontend
    once the tokens get exchanged with authorisation code, we are stoing them in the session
    as in the next routes, we will need these tokens to make requests to the google calendar API and other such APIs */

router.post('/login', extractTokens, (req, res) => {
    req.session.tokens = req.tokens;
    res.status(200).json({ success: true, message: 'Login successful' });
});


/* --------------------------------------------------------------------------------------------------------------------
    [getEvents route]- this is the route where the frontend will make request to get the events data from the google calendar API
    the request first goes through the refreshTokens middleware, where
    first we check if user has a valid session id (which is done by checking if the tokens are present in the redis session store).
    the access token is then refreshed if it's expired and new tokens are generated and passed to the getEventsController.
    the getEventsController fetches the events data and send it to the frontend and the request is served !!  */

router.get('/getEvents', refreshTokens, getEventsController);




/* --------------------------------------------------------------------------------------------------------------------
    [logout route]- this is the route where the frontend will make request to logout the user
    to logout, we simply destroy the session data of the user so if he comes again, his session data will no longer be available in the session store */

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({ success: true, message: 'Logout successful' });
});

module.exports = router;