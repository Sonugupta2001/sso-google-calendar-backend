const { google } = require('googleapis');

// middleware to refresh the tokens (access token, refresh token etc.) using the refresh token
exports.refreshTokens = async (req, res, next) => {
    try {
        // if the session doesn't have the tokens, that means the user is not logged in, hence unauthorized
        if (!req.session.tokens) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        // new OAuth2 client to refresh the tokens using the refresh token 
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'postmessage' // [fix - stackOverflow] - a string as argument for the redirect_uri
        );
        oauth2Client.setCredentials(req.session.tokens);

        const tokens = await oauth2Client.refreshAccessToken();
        oauth2Client.setCredentials(tokens);

        // once we get the refreshed tokens, we store them in the session store
        req.session.tokens = tokens.credentials;

        next();
    }
    catch (err) {
        console.error('Error refreshing tokens: ', err);
        res.status(401).json({ success: false, message: 'Error refreshing tokens' });
    }
}