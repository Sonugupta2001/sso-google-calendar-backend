const {google} = require('googleapis');

exports.getEventsController = async (req, res) => {
  try {
    console.log('[last stage of getEvents route] serving the getEvents request..');
    console.log('entered getEventsController..');

    const access_token = req.session.tokens.access_token;
    const refresh_token = req.session.tokens.refresh_token;

    console.log('received access_token:', access_token);
    console.log('received refresh_token:', refresh_token);

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage'
    );

    oauth2Client.setCredentials({
      access_token: access_token,
      refresh_token: refresh_token,
    });
    
    oauth2Client.setCredentials(req.session.tokens);

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    console.log('events fetched !!');
    console.log('[final stage of getEvents route] serving the events request..')
    res.status(200).json({ success: true, events: events.data.items });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};