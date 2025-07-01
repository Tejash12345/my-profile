# Deploying to Render

This guide will help you deploy your full-stack MERN portfolio app (backend + frontend) to [Render](https://render.com/).

## 1. Prerequisites
- All code pushed to GitHub.
- MongoDB connection string (for `MONGO_URI`).

## 2. Project Structure
```
repo/
  backend/   # Express, API, serves frontend in production
  frontend/  # React, Vite
```

## 3. Backend Setup (Render Web Service)
- **Root Directory:** `backend`
- **Build Command:** `npm run build`
- **Start Command:** `npm start`

### What the Build Command Does
- Installs frontend dependencies and builds the React app into `frontend/dist`.
- Backend (`server.js`) is already set up to serve these static files.

## 4. Environment Variables
Set these in the Render dashboard:
- `MONGO_URI` (your MongoDB connection string)
- Any others you use (e.g., `CLIENT_ORIGIN`)

## 5. Steps on Render
1. Create a new **Web Service**.
2. Connect your GitHub repo.
3. Set the root directory to `backend`.
4. Set the build/start commands as above.
5. Add environment variables.
6. Click **Create Web Service**.

## 6. Done!
Render will build the frontend, then start the backend, which serves the frontend and API from a single service.

---

**Tip:**
- To update your app, push changes to GitHub; Render redeploys automatically.
- For static assets (images, etc.), make sure they are in the correct public/build folders. 