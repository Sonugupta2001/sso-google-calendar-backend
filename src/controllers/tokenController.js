const { google } = require('googleapis');

exports.extractTokens = async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(400).json({ success: false, message: 'Authorization code is required' });
    }

    const authCode = header.split(' ')[1];

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage'
    );

    const { tokens } = await oauth2Client.getToken({
      code: authCode,
      redirect_uri: 'postmessage'
    });

    res.status(200).json({ success: true, tokens: tokens });
  }
  catch (error) {
    console.error('Error in Google Authentication:', error);
    res.status(500).json({ success: false, message: 'Authentication failed' });
  }
}