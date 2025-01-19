const { google } = require('googleapis');

exports.getEventsController = async (req, res) => {
  try {
    // new OAuth2 client instance and setting up the credentials
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: req.token });

    // a new calendar instance
    const calendar = google.calendar({ version: 'v3', auth });
    // Fetch the events from the user's primary calendar
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    res.status(200).json({ success: true, events: events.data.items });
  }
  catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
};