const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const tokenRoutes = require('./routes/tokenRoutes');
const eventRoutes = require('./routes/eventRoutes');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(cookieParser());


app.use('/api/auth', tokenRoutes);
app.use('/api/events', eventRoutes);


// Response for preflight requests
app.options('*', (req, res) => {
    res.status(200).send();
});

app.get('/', (req, res) => {
    res.json({ success: true, message: 'Welcome to the Google Calendar API' });
});

module.exports = app;