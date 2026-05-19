# 💉 BloodCare — AI Integrated Blood Donor & Receiver Platform

> A full-stack web platform that connects blood donors and recipients in real time, with AI-powered assistance and emergency alert notifications.

🔗 **Live Demo:** [https://blood-care-five.vercel.app](https://blood-care-five.vercel.app)

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Vite, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcrypt, Google OAuth, OTP via Nodemailer |
| Real-time | Socket.IO (chat + typing indicators) |
| AI | Google Gemini API |
| Deployment | Vercel (frontend) + Render (backend) |

---

## ✨ Key Features

- 🔐 **Secure Auth** — Email + OTP verification, Google OAuth, JWT sessions, forgot/reset password
- 🩸 **Donor Registry** — Register with blood group, city, medical details and toggle availability
- 🔍 **Donor Search** — Search available donors by city and blood group in real time
- 🚨 **Urgent Requests** — Post emergency blood requests visible to all users in the city; auto-expires in 7 days
- 📧 **Email Alerts** — Donors in the same city get instant email notification when an urgent request is posted
- 💬 **Real-Time Chat** — Direct messaging between recipients and donors using Socket.IO
- 🤖 **AI Chatbot** — Gemini-powered assistant for donation eligibility, health tips, and blood compatibility
- 📖 **Health Articles** — Curated content on blood donation, nutrition, and lifestyle

---

## 📁 Project Structure

```
bloodcare/
├── client/              # React frontend (Vite)
│   └── src/
│       ├── pages/       # All page components
│       ├── components/  # Navbar, AIChatbot
│       └── context/     # Auth context
└── server/              # Node.js + Express backend
    ├── models/          # Mongoose schemas
    ├── routes/          # API routes
    ├── middleware/      # JWT auth middleware
    └── utils/           # Email helpers
```

---

## ⚙️ Local Setup

```bash
# Clone the repo
git clone https://github.com/Aryan-Singh31/BloodCare.git
cd bloodcare

# Install dependencies
cd server && npm install
cd ../client && npm install
```

**server/.env**
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
EMAIL_USER=your_gmail
EMAIL_PASS=your_gmail_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GEMINI_API_KEY=your_gemini_key
```

**client/.env**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

```bash
# Run backend
cd server && npm run dev

# Run frontend
cd client && npm run dev
```

App runs at **http://localhost:3000**

---

## 🛡️ API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register with email |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/google` | Google OAuth |
| GET | `/api/donors/search` | Search donors by city & blood group |
| POST | `/api/donors/register` | Register as donor |
| POST | `/api/urgent` | Post urgent blood request |
| GET | `/api/urgent` | Get urgent requests by city |
| GET | `/api/chat/conversations` | Get all conversations |
| POST | `/api/ai/chat` | Chat with Gemini AI |

---

Built with ❤️ to save lives — BloodCare
