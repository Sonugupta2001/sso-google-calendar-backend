exports.getProfileController = async (req, res) => {
  try {
    // Extract user data from the request object
    const user = {
      email: req.user.email,
      name: req.user.name,
      picture: req.user.picture,
    };

    res.status(200).json({ success: true, user });
  }
  catch (error) {
    console.error('Error in Google Authentication:', error);
    res.status(500).json({ success: false, message: 'Authentication failed' });
  }
};
