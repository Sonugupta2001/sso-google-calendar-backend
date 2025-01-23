# google-sso-calendar-backend [Technical Documentation]

## Overview
This project integrates the Google Calendar API with a Node.js backend to provide functionalities such as user authentication, token management, and event retrieval. It uses OAuth 2.0 for secure user authentication and Redis for session management.

### Core Features:
1. **Google OAuth 2.0 Integration**: Secure user authentication.
2. **Token Management**: Extraction, refreshing, and storage of access and refresh tokens.
3. **Event Retrieval**: Fetch events from the user's Google Calendar.
4. **Session Management**: Sessions are stored using Redis for secure and scalable token handling.

---

## Setup Instructions

### Prerequisites
1. **Google Cloud Project**:
   - Create a project on [Google Cloud Console](https://console.cloud.google.com/).
   - Enable the "Google Calendar APIs" and "Public Profile APIs" for your google cloud project
   - Create OAuth 2.0 credentials and download the `credentials.json` file, and note down the "Client ID" and "Client Secret".
   - (Please set the necessary Authorized JavaScript origins and Authorized redirect URIs).

2. **Redis Setup**:
   - Install Redis on your server or use a managed Redis service.
   - Note down the host, port, username, and password.

3. **Node.js Environment**:
   - Install Node.js (v14 or later).

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Sonugupta2001/sso-google-calendar-backend
   cd sso-google-calendar-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the root directory with the following keys:
     ```env
     GOOGLE_CLIENT_ID=<your_google_client_id>
     GOOGLE_CLIENT_SECRET=<your_google_client_secret>
     REDIS_USERNAME=<your_redis_username>
     REDIS_PASSWORD=<your_redis_password>
     REDIS_HOST=<your_redis_host>
     REDIS_PORT=<your_redis_port>
     SESSION_SECRET=<your_session_secret>
     PORT=<your_port_number_for_express_app>
     ```
4. Set up Redis:
   - Start the Redis server if hosting locally, or ensure the managed Redis service is accessible.
   - In default the express-session uses its in-memory session store. So For local development, the redis setup can also be ignored for simplicity.
   - (In this case, remove the 'store' field from the session parameters so the express will use it default session store).

5. Run the application:
   ```bash
   npm start
   ```
6. Access the API:
   - Base URL: `http://localhost:PORT/`
   - Test endpoints using tools like Postman or curl.
---

## Project Structure
### Directory Layout
```
src/
├── controllers/
│   └── getEventController.js
├── middlewares/
│   ├── extractTokens.js
│   └── refreshTokens.js
├── routes/
│   └── eventRoutes.js
├── app.js
```

---

## API Endpoints

### **1. Login**
- **URL**: `/api/login`
- **Method**: `POST`

- **Request Headers**:
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "code": "<AUTHORIZATION_CODE>"
}
```
- **Response**:
  - **200 OK**:
```json
{
  "success": true,
  "message": "Login successful"
}
```
  - **400 Bad Request**:
```json
{
  "success": false,
  "message": "Authorization code is required"
}
```
  - **500 Internal Server Error**:
```json
{
  "success": false,
  "message": "Authentication failed"
}
```

### **2. Get Events**
- **URL**: `/api/getEvents`
- **Method**: `GET`

- **Response**:
  - **200 OK**:
```json
{
  "success": true,
  "events": [
    {
      "id": "<EVENT_ID>",
      "summary": "<EVENT_SUMMARY>",
      "start": {"dateTime": "<START_TIME>"},
      "end": {"dateTime": "<END_TIME>"}
    }
  ]
}
```
  - **401 Unauthorized**:
```json
{
  "success": false,
  "message": "Unauthorized"
}
```
  - **500 Internal Server Error**:
```json
{
  "success": false,
  "message": "Error refreshing tokens"
}
```

### **3. Logout**
- **URL**: `/api/logout`
- **Method**: `GET`

- **Response**:
  - **200 OK**:
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Middleware

### **extractTokens.js**
Extracts and validates tokens using the authorization code provided by the client.
- **Input**: Authorization code in request body.
- **Output**: Tokens are added to `req.tokens`.
- **Errors**:
  - If no authorization code is provided, responds with `400 Bad Request`.
  - If token extraction fails, responds with `500 Internal Server Error`.

### **refreshTokens.js**
Refreshes access and refresh tokens to ensure continuous access to the Google Calendar API.
- **Input**: Tokens from the session.
- **Output**: Updated tokens are stored in the session and passed to the next middleware.
- **Errors**:
  - If tokens are missing, responds with `401 Unauthorized`.
  - If token refreshing fails, responds with `401 Unauthorized`.

---

## Controller

### **getEventController.js**
Handles the logic for fetching events from the Google Calendar.
- **Steps**:
  1. Reads tokens from the session.
  2. Configures the Google OAuth2 client with tokens.
  3. Fetches events from the user's primary calendar.
  4. Responds with the list of events.
- **Error Handling**:
  - Responds with `500 Internal Server Error` if event retrieval fails.

---

## Session Management
- **Library**: `express-session`
- **Store**: Redis, configured with `connect-redis`.
- **Configuration**:
  - **Cookie Settings**:
    - `secure`: `true` for production (HTTPS).
    - `httpOnly`: Prevents client-side JavaScript from accessing cookies.
    - `sameSite`: `none` for cross-origin requests.
    - `maxAge`: 10 minutes.
  - **Session Secret**: `process.env.SESSION_SECRET`.

---

## Environment Variables
Ensure the following environment variables are set:
```env
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
REDIS_USERNAME=<your_redis_username>
REDIS_PASSWORD=<your_redis_password>
REDIS_HOST=<your_redis_host>
REDIS_PORT=<your_redis_port>
SESSION_SECRET=<your_session_secret>
PORT=<your_port_number_for_express_app>
```

---

## External Dependencies

### Libraries Used
- **Google APIs**: `googleapis`
- **Session Management**: `express-session`, `connect-redis`
- **Security**: `helmet`
- **Logging**: `morgan`
- **Cross-Origin Resource Sharing**: `cors`
- **Environment Variables**: `dotenv`
- **Redis Client**: `redis`

---

## Author
Sonu Gupta

---

## License
MIT License

