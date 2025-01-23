const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const eventRoutes = require('./routes/eventRoutes');
const cookieParser = require('cookie-parser');
const { RedisStore } = require('connect-redis');
const { createClient } = require('redis');
const session = require('express-session');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', true);

// cors configuration
app.use(cors({
    // origin's production url - https://sso-google-calendar-frontend.vercel.app
    // origin's development url - http://localhost:3000
    origin: 'https://sso-google-calendar-frontend.vercel.app',
    credentials: true,
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
}));

// initialising redis client for the session store
const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
});
client.on('error', err => console.log('Redis Client Error', err));

// connecting to redis server
(async () => {
    try {
        await client.connect();
        console.log('Redis Connected Successfully !!');
    }
    catch (error) {
        console.error('Error in Redis Connection:', error);
    }
})();

// session middleware configuration
// (this middleware must be used before any routes to make the session available in the routes)
app.use(session({
    store: new RedisStore({ client: client }), // redis is used as the session store
    secret: process.env.SESSION_SECRET, // we can define our own session secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // set false for local development, for production must be set to true
        httpOnly: true,
        sameSite: 'none', // for local development, set to 'lax' or remove it alltogether
        maxAge: 1000 * 60 * 10,
    }
}));

// binding the API routes to the express app
app.use('/api', eventRoutes);
app.get('/', (_, res) => {
    res.json({ success: true, message: 'Welcome to the Google Calendar API' });
});

module.exports = app;