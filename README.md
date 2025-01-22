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
   - Enable the "Google Calendar API" for your project.
   - Create OAuth 2.0 credentials and download the `credentials.json` file.
2. **Redis Setup**:
   - Install Redis on your server or use a managed Redis service.
   - Note down the host, port, username, and password.
3. **Node.js Environment**:
   - Install Node.js (v14 or later).

### Steps
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_name>
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
     ```
4. Set up Redis:
   - Start the Redis server if hosting locally, or ensure the managed Redis service is accessible.
5. Run the application:
   ```bash
   npm start
   ```
6. Access the API:
   - Base URL: `http://localhost:3000`
   - Test endpoints using tools like Postman or curl.

### Testing OAuth 2.0
- Redirect users to the Google OAuth consent screen using the following URL:
  ```
  https://accounts.google.com/o/oauth2/auth?client_id=<GOOGLE_CLIENT_ID>&redirect_uri=<REDIRECT_URI>&response_type=code&scope=https://www.googleapis.com/auth/calendar.events.readonly
  ```
- Replace `<GOOGLE_CLIENT_ID>` and `<REDIRECT_URI>` with your credentials.

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
- **Middleware**: `extractTokens`
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
- **Middleware**: `refreshTokens`
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

## Deployment Notes
1. Ensure that the **Google OAuth 2.0 credentials** are correctly configured in the Google Cloud Console.
2. Use HTTPS in production to secure cookie transmission.
3. Set appropriate CORS policies for the frontend domain.
4. Monitor Redis performance to handle high traffic effectively.

---

## Testing
- **Manual Tests**:
  1. Verify login and token extraction with valid and invalid authorization codes.
  2. Ensure events are retrieved correctly for authenticated users.
  3. Validate session expiration and token refreshing.
  4. Check logout functionality clears the session.
- **Automated Tests**:
  - Use tools like `Mocha` or `Jest` for unit and integration testing.

---

## Future Improvements
1. **Dynamic Calendar Selection**: Allow users to fetch events from specific calendars.
2. **Pagination**: Implement pagination for event retrieval to handle large datasets.
3. **Role-Based Access Control (RBAC)**: Add roles to restrict API usage.
4. **Error Handling Enhancements**: Improve error messages and add retry mechanisms.
5. **Scalability**: Optimize Redis usage and add horizontal scaling to handle higher traffic volumes.

---

## Author
[Your Name]

---

## License
MIT License

