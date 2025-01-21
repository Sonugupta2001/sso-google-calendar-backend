const { google } = require('googleapis');

exports.authenticateGoogleCode = async (req, res, next) => {
  try {
    const access_token = req.headers.authorization.split(' ')[1];
    const refresh_token = req.headers['x-refresh-token'];

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage'
    );

    oauth2Client.setCredentials({
      access_token: access_token,
      refresh_token: refresh_token,
    });


    const response = await oauth2Client.refreshAccessToken();
    const new_access_token = response.credentials.access_token;
    const new_id_token = response.credentials.id_token;

    oauth2Client.setCredentials({ access_token: new_access_token });


    const ticket = await oauth2Client.verifyIdToken({
      idToken: new_id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    req.access_token = new_access_token;
    req.refresh_token = refresh_token;
    req.user = payload;

    next();
  }
  catch (error) {
    console.error(error);
    res.status(403).json({ success: false, message: error.message });
  }
};