const { OAuth2Client } = require('google-auth-library');


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.authenticateGoogleToken = async (req, res, next) => {
  // Get the token from the request headers
  const authHeader = req.headers['authorization'];
  // Check if the token exists
  const token = authHeader && authHeader.split(' ')[1];

  // If the token does not exist, return an error response
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }


  try {
    // Verify the token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    // Set the token in the request object
    req.token = token;
    // Extract the user's information and set it in the request object
    req.user = ticket.getPayload();

    next();
  }
  catch (error) {
    console.error('Invalid Google Token:', error);
    res.status(403).json({ success: false, message: 'Invalid token' });
  }
};