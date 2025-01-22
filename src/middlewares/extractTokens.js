const { google } = require('googleapis');

exports.extractTokens = async (req, res, next) => {
  try {
    const authCode = req.body.code;
    if (!authCode) {
      return res.status(400).json({ success: false, message: 'Authorization code is required' });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage'
    );

    const {tokens} = await oauth2Client.getToken({
      code: authCode,
      redirect_uri: 'postmessage'
    });

    req.tokens = tokens;
    next();
  }
  catch (error) {
    console.error('Error in Google Authentication:', error);
    res.status(500).json({ success: false, message: 'Authentication failed' });
  }
}