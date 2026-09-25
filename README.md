# 🚀 SkillSwapLive — Real-Time Peer-to-Peer Knowledge Exchange Platform

**SkillSwapLive** is a modern full-stack web application designed for reciprocal knowledge sharing. Teach what you love, learn what you desire, and collaborate 1-on-1 in a live virtual classroom with video calling, interactive whiteboard, collaborative code editor, and instant messaging — without exchanging money.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js 19 + Vite, Tailwind CSS (v4), Lucide Icons, React Router DOM, Canvas Confetti |
| **Backend** | Node.js, Express.js (ES Modules), Socket.io |
| **Database** | MongoDB Atlas (via Mongoose ORM) |
| **Authentication** | JSON Web Tokens (JWT) + bcryptjs password hashing |
| **Real-time Live** | Socket.io WebRTC Signaling + HTML5 Canvas Whiteboard + Synchronized Code Workspace |

---

## ✨ Key Features

1. **🔐 JWT Authentication & Security**
   - User registration and login with bcrypt salted password hashing.
   - Protected routes and JWT bearer token headers on Axios requests.
   - Instant 1-Click Demo Accounts for quick testing (Elena, Carlos, Aisha, David).

2. **🔍 Smart Skill Marketplace & Matchmaking**
   - Search across topics, names, and skill categories (Web Dev, AI, Languages, Design, Music, Marketing).
   - Dynamic match percentage score calculated between what you teach and what a partner wants to learn.
   - Filter by category, proficiency level (Beginner, Intermediate, Advanced, Expert), and available days.

3. **🤝 Swap Proposal Management**
   - Propose 1-on-1 swaps (Select skill pair, proposed date, time slot, duration, message).
   - Accept / Decline incoming requests.
   - Direct launch of the private live meeting room (`/live/:roomId`).

4. **🎥 Live Virtual Classroom (`/live/:roomId`)**
   - **1-on-1 WebRTC Video / Audio**: Microphone & Camera toggles, Screen sharing, participant indicators, session timer.
   - **Interactive HTML5 Whiteboard**: Real-time collaborative canvas syncing brush strokes, eraser, colors, and PNG export.
   - **Collaborative Code & Notes Editor**: Multi-language support (JavaScript, Python, Markdown), real-time sync, and sandbox execution.
   - **In-Room Chat**: Instant low-latency socket messaging during sessions.

5. **💬 Direct Messenger (`/messages`)**
   - Real-time 1-on-1 chat with online presence indicator, message history, and quick swap actions.

6. **⭐ Post-Session Review & Ratings**
   - 5-star rating system with testimonials and dynamic average score calculation.
   - Celebration confetti trigger upon review submission.

---

## 📁 Directory Structure

```text
skillswaplive/
├── package.json              # Root script runner
├── README.md                 # Complete documentation
│
├── server/                   # Backend Express.js Server
│   ├── config/
│   │   └── db.js             # MongoDB Atlas connection setup
│   ├── controllers/
│   │   ├── authController.js # Register, Login, Me, Update Profile
│   │   ├── userController.js # Search, Filter, Matchmaking
│   │   ├── swapController.js # Swap request lifecycle & status
│   │   ├── messageController.js # Chat history & messenger
│   │   └── reviewController.js  # Ratings & testimonials
│   ├── middleware/
│   │   ├── authMiddleware.js # JWT Protect middleware
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js           # User schema & skill profiles
│   │   ├── SwapRequest.js    # Swap state & room IDs
│   │   ├── Message.js        # Direct chat messages
│   │   ├── Review.js         # Partner reviews & stars
│   │   └── Notification.js   # Real-time user alerts
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── swapRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── notificationRoutes.js
│   ├── sockets/
│   │   └── socketManager.js  # Socket.io chat, WebRTC signaling & whiteboard
│   ├── seed.js               # Demo users & sample swap seed script
│   ├── server.js             # Main server entrypoint
│   ├── .env                  # Environment variables
│   └── .env.example
│
└── client/                   # Frontend React + Tailwind CSS
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── SkillTag.jsx
    │   │   ├── UserCard.jsx
    │   │   ├── SwapRequestModal.jsx
    │   │   ├── ReviewModal.jsx
    │   │   ├── LiveWhiteboard.jsx
    │   │   ├── LiveCodeEditor.jsx
    │   │   └── LiveVideoCall.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── SocketContext.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── ExplorePage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── EditProfilePage.jsx
    │   │   ├── SwapsPage.jsx
    │   │   ├── LiveRoomPage.jsx
    │   │   ├── MessagesPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   └── RegisterPage.jsx
    │   ├── services/
    │   │   └── api.js        # Axios instance with JWT interceptor
    │   ├── App.jsx           # React Router routing
    │   ├── index.css         # Tailwind & glassmorphic styling
    │   └── main.jsx
    ├── index.html
    └── vite.config.js
```

---

## ⚡ Quick Start Guide

### 1. Configure MongoDB Atlas & Environment
Open `server/.env` and replace `MONGODB_URI` with your MongoDB Atlas connection string (or use local MongoDB):

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/skillswaplive?retryWrites=true&w=majority
JWT_SECRET=skillswap_live_super_secret_jwt_key_2026_secure
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

### 2. (Optional) Seed Initial Demo Users & Swaps
Populate the database with rich demo users (Elena, Carlos, Aisha, David, Maya):
```bash
cd server
npm run seed
```

### 3. Run the Development Servers

**Option A (Separate Terminals):**

- **Terminal 1 (Backend Server):**
  ```bash
  cd server
  npm run dev
  ```
  *Server runs at `http://localhost:5000` with Socket.io active.*

- **Terminal 2 (Frontend Client):**
  ```bash
  cd client
  npm run dev
  ```
  *Client runs at `http://localhost:5173`.*

---

## 🔑 Demo Login Credentials

For instant testing, use the 1-Click Demo buttons on the Login page or sign in with:
- **Elena Rostova:** `elena@skillswap.com` / `password123` (Teaches: React & Next.js | Wants: Spanish)
- **Carlos Mendoza:** `carlos@skillswap.com` / `password123` (Teaches: Spanish & Guitar | Wants: React)
- **Aisha Patel:** `aisha@skillswap.com` / `password123` (Teaches: Figma UI/UX | Wants: Python AI)
- **David Kim:** `david@skillswap.com` / `password123` (Teaches: Python & Machine Learning | Wants: Figma)

---

## 🌐 Production Deployment Guide

### Option 1: Backend on Render & Frontend on Vercel (Recommended)

#### Step 1: Deploy Backend (Render Web Service)
1. Push this repository to GitHub (`main` branch).
2. Go to [Render Dashboard](https://dashboard.render.com/) -> **New** -> **Web Service**.
3. Connect your GitHub repository `skillswaplive`.
4. Configure settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `PORT`: `5000`
   - `MONGODB_URI`: `<Your MongoDB Atlas connection string>`
   - `JWT_SECRET`: `<A strong random secret string>`
   - `JWT_EXPIRE`: `30d`
   - `CLIENT_URL`: `https://your-frontend-app.vercel.app` (Add after creating Vercel app)
   - `NODE_ENV`: `production`
6. Click **Deploy Web Service** and copy your backend live URL (e.g. `https://skillswap-api.onrender.com`).

#### Step 2: Deploy Frontend (Vercel)
1. Go to [Vercel Dashboard](https://vercel.com/) -> **Add New Project**.
2. Import your GitHub repository `skillswaplive`.
3. Configure settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://skillswap-api.onrender.com/api`
   - `VITE_SOCKET_URL`: `https://skillswap-api.onrender.com`
5. Click **Deploy**.
6. Once deployed, copy your frontend URL and update the `CLIENT_URL` environment variable on Render!

---

### Option 2: Deploy Backend on Railway
1. Go to [Railway.app](https://railway.app/) -> **New Project** -> **Deploy from GitHub repo**.
2. Set Root Directory to `/server`.
3. Add environment variables: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `CLIENT_URL`.
4. Expose the port in Railway networking settings.

