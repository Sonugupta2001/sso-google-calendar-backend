const { google } = require('googleapis');

// extractTokens middleware to extract the tokens from the authorization code
exports.extractTokens = async (req, res, next) => {
  try {
    // access and verify if the authorization code is present in the request body
    const authCode = req.body.code;
    if (!authCode) {
      return res.status(400).json({ success: false, message: 'Authorization code is required' });
    }

    // create a new OAuth2 client and get the tokens from the authorization code
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage'
    );

    // exchange the authorization code with the tokens (access token, refresh token, id token)
    const {tokens} = await oauth2Client.getToken({
      code: authCode,
      redirect_uri: 'postmessage'
    });

    // attach the tokens to the request object for the next middlewares to use
    req.tokens = tokens;
    
    next();
  }
  catch (error) {
    console.error('Error in extracting tokens:', error);
    res.status(500).json({ success: false, message: 'Authentication failed' });
  }
}