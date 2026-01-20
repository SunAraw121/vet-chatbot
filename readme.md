# 🐾 Veterinary Chatbot SDK (MERN + Gemini AI)

A professional, plug-and-play chatbot SDK designed for veterinary clinics. Built with the MERN stack and powered by **Google Gemini 2.5 Flash** for intelligent, context-aware conversations.

---

## ✨ Features

### 🔹 Core Requirements
- **Intelligent AI Q&A**: Answers pet-related questions (diet, vaccines, care) using Google Gemini.
- **Conversational Booking**: A custom state-machine flow to collect appointment details (Owner, Pet, Phone, Time).
- **Session Persistence**: Remembers chat history even after page refresh.
- **Plug-and-Play SDK**: Easily embed the chatbot into any website with a single `<script>` tag.
- **Data Persistence**: All conversations and appointments are securely stored in MongoDB.

### 🔹 Bonus Features ✨
- **Admin Dashboard**: A dedicated UI to view and manage all booked appointments.
- **Dockerized**: Containerized backend and database for "one-click" deployment.
- **Automated Tests**: Unit tests for the intent detection logic using Jest.
- **Comprehensive Docs**: Full architecture diagrams and deployment guides.
- **Responsive UI**: Modern, glassmorphic design that works on mobile and desktop.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB Atlas** (or local MongoDB)
- **Google Gemini API Key** (Get one at [Google AI Studio](https://aistudio.google.com/))

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your MONGO_URI and GEMINI_API_KEY
npm start
```
*Backend will run on `http://localhost:4000`*

### 3. Frontend / SDK Demo Setup
```bash
cd frontend/vet-chatbot-ui
npm install
npm run dev
```
*Demo site will run on `http://localhost:5173`*

### 4. Admin Dashboard
Go to `http://localhost:5173/admin` to see all appointments booked via the chatbot.

---

## 🐳 Docker (Bonus)
Run the entire stack without installing dependencies locally:
```bash
docker-compose up --build
```

---

## 🧪 Testing (Bonus)
Run the logic unit tests:
```bash
cd backend
npm test
```

---

## 📂 Project Structure
```text
vet-chatbot/
├── backend/                # Node/Express API
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── services/       # Gemini AI integration
│   │   └── utils/          # Intent detection & flows
│   └── tests/              # Jest test cases
├── frontend/
│   └── vet-chatbot-ui/     # React SDK & Admin Dashboard
│       ├── src/
│       │   ├── components/ # UI components
│       │   └── AdminDashboard.jsx
├── ARCHITECTURE.md         # Design diagrams & logic
└── docker-compose.yml       # Orchestration
```

---

## 🌍 Deployment

### Backend (Render/Heroku)
1. Set **Root Directory** to `backend`.
2. Set **Build Command** to `npm install`.
3. Set **Start Command** to `npm start`.
4. Add **Environment Variables**: `MONGO_URI`, `GEMINI_API_KEY`.

### Frontend (Vercel/Netlify)
1. Set **Root Directory** to `frontend/vet-chatbot-ui`.
2. Set **Build Command** to `npm run build`.
3. Set **Output Directory** to `dist`.

---

## 🛠 Tech Stack
- **Frontend**: React, Vite, Axios, Lucide React (Icons).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **AI**: Google Generative AI (Gemini 2.5 Flash).
- **DevOps**: Docker, Docker Compose, Jest.

---
*Created for the Veterinary Chatbot Assignment.*
