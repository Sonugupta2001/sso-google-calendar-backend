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
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
}));


const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
});

client.on('error', err => console.log('Redis Client Error', err));

(async () => {
    try {
        await client.connect();
        console.log('Redis Connected Successfully !!');
    }
    catch (error) {
        console.error('Error in Redis Connection:', error);
    }
})();

app.use(session({
    store: new RedisStore({ client: client }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // for local development, set to false, for production set to true
        httpOnly: true,
        sameSite: 'none', // for local development, set to 'lax' or remove it alltogether
        maxAge: 1000 * 60 * 10,
    }
}));


app.use('/api', eventRoutes);

app.get('/', (_, res) => {
    res.json({ success: true, message: 'Welcome to the Google Calendar API' });
});

module.exports = app;