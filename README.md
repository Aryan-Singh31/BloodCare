# 💉 BloodCare — AI Integrated Donor & Receiver Platform

A full-stack MERN application connecting blood donors and recipients with AI-powered features.

---

## 🚀 Tech Stack

- **Frontend**: React 18, React Router v6, Socket.io Client, Framer Motion, React Icons
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB + Mongoose
- **Auth**: JWT, Google OAuth, OTP via Nodemailer
- **AI**: Google Gemini API (chatbot)
- **Real-time**: Socket.io (chat + typing indicators)

---

## 📁 Project Structure

```
bloodcare/
├── server/          # Express backend
│   ├── models/      # Mongoose models
│   ├── routes/      # API routes
│   ├── middleware/  # Auth middleware
│   └── utils/       # Email helpers
└── client/          # React frontend
    └── src/
        ├── pages/   # All page components
        ├── components/
        │   └── common/  # Navbar, AIChatbot
        └── context/     # Auth context
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Gmail account (for OTP emails)
- Google OAuth credentials
- Gemini API key

### 1. Clone & Install

```bash
# Install server dependencies
cd bloodcare/server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Server Environment Variables

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bloodcare
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
CLIENT_URL=http://localhost:3000

# Gmail (use App Password, not regular password)
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_16_char_app_password

# Google OAuth — from console.cloud.google.com
GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com

# Gemini AI — from aistudio.google.com
GEMINI_API_KEY=AIzaSy_your_gemini_key
```

### 3. Client Environment Variables

Create `client/.env` from `client/.env.example`:

```env
REACT_APP_GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 4. Google OAuth Setup
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. Enable Google Identity API
4. Create OAuth 2.0 credentials (Web application)
5. Add `http://localhost:3000` to Authorized JavaScript Origins
6. Copy the Client ID to both `.env` files

### 5. Gmail App Password
1. Enable 2-Factor Authentication on your Gmail
2. Go to Google Account → Security → App Passwords
3. Generate a new app password for "Mail"
4. Use that 16-character password as `EMAIL_PASS`

### 6. Gemini API Key
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Create an API key
3. Add it as `GEMINI_API_KEY`

### 7. Run the Application

```bash
# Terminal 1 — Start MongoDB (if local)
mongod

# Terminal 2 — Start server
cd bloodcare/server
npm run dev

# Terminal 3 — Start client
cd bloodcare/client
npm start
```

App runs at **http://localhost:3000** 🎉

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Auth | Email/OTP, Google OAuth, JWT, Forgot Password |
| 🩸 Donor Registry | Register with blood group, city, availability toggle |
| 🔍 Donor Search | Filter by city + blood group |
| 🚨 Urgent Requests | Post city-wide blood alerts |
| 💬 Real-Time Chat | Socket.io with typing indicators |
| 🤖 AI Chatbot | Gemini-powered health assistant |
| 📖 Articles | Blood health & lifestyle tips |
| 📱 Responsive | Full mobile support |

---

## 🛡️ API Endpoints

### Auth
- `POST /api/auth/register` — Register with email
- `POST /api/auth/verify-otp` — Verify email OTP
- `POST /api/auth/login` — Login
- `POST /api/auth/google` — Google OAuth
- `POST /api/auth/forgot-password` — Send reset email
- `POST /api/auth/reset-password/:token` — Reset password
- `GET /api/auth/me` — Get current user

### Donors
- `POST /api/donors/register` — Register as donor
- `GET /api/donors/search?city=&bloodGroup=` — Search donors
- `GET /api/donors/me` — Get my donor profile
- `PATCH /api/donors/availability` — Toggle availability

### Urgent Requests
- `POST /api/urgent` — Post urgent request
- `GET /api/urgent?city=` — Get requests by city
- `PATCH /api/urgent/:id/fulfill` — Mark fulfilled

### Chat
- `GET /api/chat/conversations` — Get all conversations
- `GET /api/chat/conversation/:userId` — Get/start conversation

### Articles
- `GET /api/articles?category=&page=` — Get articles
- `GET /api/articles/:id` — Get single article

### AI
- `POST /api/ai/chat` — Chat with Gemini AI

---

## 🔌 Socket Events

| Event | Direction | Payload |
|---|---|---|
| `join` | Client → Server | `userId` |
| `sendMessage` | Client → Server | `{to, from, message, conversationId}` |
| `receiveMessage` | Server → Client | Message object |
| `typing` | Client → Server | `{to, from}` |
| `stopTyping` | Client → Server | `{to}` |

---

## 📦 Deployment

### Backend (Railway / Render)
1. Push to GitHub
2. Connect repo to Railway/Render
3. Set environment variables
4. Deploy

### Frontend (Vercel / Netlify)
1. Set `REACT_APP_API_URL` to your deployed backend URL
2. Connect repo and deploy

---

Built with ❤️ to save lives — BloodCare Team
