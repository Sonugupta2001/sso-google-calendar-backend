const { google } = require('googleapis');

exports.refreshTokens = async (req, res, next) => {
    try {
        if (!req.session.tokens) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'postmessage'
        );
        oauth2Client.setCredentials(req.session.tokens);


        const tokens = await oauth2Client.refreshAccessToken();
        oauth2Client.setCredentials(tokens);

        req.session.tokens = tokens.credentials;
        req.tokens = tokens;
        
        next();
    }
    catch (err) {
        console.error('Error refreshing tokens: ', err);
        res.status(401).json({ success: false, message: 'Error refreshing tokens' });
    }
}