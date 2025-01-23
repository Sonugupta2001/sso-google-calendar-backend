const {google} = require('googleapis');

// getEventsController to fetch the events data from the google calendar API
exports.getEventsController = async (req, res) => {
  try {
    // create a new OAuth2 client and set the tokens credentials
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage'
    );
    oauth2Client.setCredentials(req.session.tokens);


    // get the calendar events
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    // get the user's public data from the google API
    const people = google.people({ version: 'v1', auth: oauth2Client });
    const user = await people.people.get({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses,photos',
    });


    // prepare the user's profile data object
    const user_data = {
      name : user.data.names[0].displayName,
      email: user.data.emailAddresses[0].value,
      photo: user.data.photos[0].url,
    }

    // send the events and user data to the frontend
    res.status(200).json({ success: true, profile: user_data, events: events.data.items });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};