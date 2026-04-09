# Event Management App

Full-stack event management application with:
- **Frontend**: React + Vite (deployed on Vercel)
- **Backend**: Node.js + Express + MongoDB (deployed on Render/Vercel)

## Project Structure

- `client/` - React frontend
- `server/` - Express backend

## Features

- User registration and login with JWT auth
- Organizer-only event creation, update, and deletion
- Event registration with ticket/QR token generation
- Attendance/check-in flow for organizers
- Event statistics and attendee tracking

## Tech Stack

- Frontend: React, Vite, Axios, React Router
- Backend: Express, Mongoose, JWT, bcryptjs, CORS
- Database: MongoDB Atlas

## Local Setup

### 1) Clone and install dependencies

```bash
git clone <your-repo-url>
cd Event2
cd server && npm install
cd ../client && npm install
```

### 2) Configure environment variables

Create `server/.env`:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3) Run the app

Backend:

```bash
cd server
npm start
```

Frontend:

```bash
cd client
npm run dev
```

## Deployment

### Backend (Render)

- Set environment variables in Render:
  - `MONGO_URI`
  - `JWT_SECRET`
  - (optional) `PORT` (Render usually provides this automatically)
- Redeploy after every env change.

### Frontend (Vercel)

- Set environment variable in Vercel:
  - `VITE_API_URL=https://your-backend-domain/api`
- Redeploy frontend after updating env variables.

## Common Production Issues

### 1) CORS blocked in browser

Error example:
`No 'Access-Control-Allow-Origin' header is present`

Fix:
- Add your deployed frontend domain to backend CORS allowlist.
- Redeploy backend.

### 2) API returns 500 with Mongo timeout

Error example:
`Operation events.find() buffering timed out after 10000ms`

This means backend is running but MongoDB is not connected in production.

Fix checklist:
- Verify `MONGO_URI` is correct in Render.
- In MongoDB Atlas Network Access, allow the backend host IP (for testing, `0.0.0.0/0`).
- Verify Atlas DB user credentials.
- URL-encode special characters in DB password.
- Redeploy backend and check logs for `DB Connected`.

## API Base URL Example

- Local: `http://localhost:5000/api`
- Production: `https://event-management-app-66x0.onrender.com/api`

## Scripts

### Server

- `npm start` - run backend with nodemon

### Client

- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview build locally

## License

ISC

