# 🐾 Veterinary Chatbot SDK

A production-ready, AI-powered chatbot SDK designed to be embedded into any veterinary website. Built with the MERN stack and Google Gemini AI, it handles general queries and conversational appointment booking.

---

## 🚀 Live Demos

*   **Try the Chatbot (Plug-and-Play Demo)**: [https://vet-chatbot.vercel.app](https://vet-chatbot.vercel.app)
*   **Admin Dashboard**: [https://vet-chatbot.vercel.app/admin](https://vet-chatbot.vercel.app/admin)
*   **Backend API Status**: [https://vet-chatbot-backend-uon9.onrender.com/](https://vet-chatbot-backend-uon9.onrender.com/)

---

## 🌟 Features

*   **🤖 AI-Powered**: Uses **Google Gemini 1.5** to answer veterinary questions (Pet care, Nutrition, Vaccinations).
*   **🚫 Domain Restricted**: System prompts ensure it politely refuses non-veterinary questions (e.g., "What is the capital of France?").
*   **📅 Conversational Booking**: Detects intent ("Book an appointment") and deeply integrates with a robust state machine to collect Owner Name, Pet Name, Phone, and Time.
*   **🔌 Plug-and-Play SDK**: Embeddable via a single `<script>` tag.
*   **🧠 Context-Aware**: Supports injecting user context (User ID, Name, Source) via `window.VetChatbotConfig`.
*   **💾 Persistent**: Stores all conversations and appointments in **MongoDB**.

---

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), CSS Modules (Premium Aesthetics)
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (Mongoose)
*   **AI**: Google Generative AI SDK (Gemini)
*   **Hosting**: Vercel (Frontend), Render (Backend)

---

## 🏗️ Architecture

The system follows a **Service-Oriented Architecture**:

1.  **Frontend / SDK**:
    *   A lightweight React app bundled into a single JS file.
    *   Loaded via `chatbot.js`, which injects it into the host website's DOM.
    *   Communicates with the backend via REST APIs.

2.  **Backend (Node/Express)**:
    *   **Controller Layer**: Handles HTTP requests and response formatting.
    *   **Service Layer**: Encapsulates external logic (Gemini AI).
    *   **Utils Layer**: Specialized logic for Intent Detection and Appointment State Management.
    *   **Data Layer**: Mongoose schemas for `Sessions` and `Appointments`.

3.  **Data Flow**:
    *   User sends message -> Backend persists message -> Intent Detector checks for "Booking" -> State Machine decides next question OR Gemini generates AI response -> Response returned.

---

## 📦 Setup Instructions

### Prerequisites
*   Node.js v16+
*   MongoDB Atlas URI
*   Google Gemini API Key

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGO_URI and GEMINI_API_KEY
npm run dev
```

### 2. Frontend Setup (Local)
```bash
cd frontend/vet-chatbot-ui
npm install
npm run dev
```

### 3. Embed the SDK
Add this to any HTML file:
```html
<script>
  window.VetChatbotConfig = {
    userId: "user_123",
    userName: "Alice",
    petName: "Luna"
  };
</script>
<script type="module" src="https://vet-chatbot-backend-uon9.onrender.com/chatbot.js"></script>
```

---

## 🧠 Key Decisions & Trade-offs

1.  **Strict State Machine vs. Pure AI for Booking**:
    *   *Decision*: We implemented a rigid state machine for booking appointments instead of letting the LLM handle it entirely.
    *   *Rationale*: Regular LLMs can "hallucinate" slot filling or forget parameters. A state machine guarantees we get exactly the data we need (Name, Phone, Date) before saving to the database.

2.  **Frontend Assets Served by Backend**:
    *   *Decision*: The `chatbot.js` loader fetches the React bundle from the backend's `public/assets` folder.
    *   *Rationale*: This prevents CORS issues when embedding the script on third-party domains and allows a Single Source of Truth for the SDK version.

3.  **Manual Options Handler**:
    *   *Decision*: Implemented a hard-stop middleware for `OPTIONS` requests.
    *   *Rationale*: To handle aggressive preflight checks from browsers when communicating across domains (e.g., Localhost -> Render), ensuring 100% reliability.

---

## 🚀 Future Improvements

*   **Real-time Slots**: Integrate with a calendar API (e.g., Google Calendar) to check actual availability.
*   **Authentication**: Add JWT auth for the Admin Dashboard.
*   **Voice Support**: Add speech-to-text for accessibility.

---

## ⭐ Bonus Features Implemented

*   ✅ **Admin Dashboard**: View all appointments at `/admin`.
*   ✅ **Modular Architecture**: Clean separation of `services`, `controllers`, and `utils`.
*   ✅ **Production Ready**: Fully deployed and optimized for performance.
*   ✅ **Tests**: Basic logic tests included in `backend/tests`.

---


