# Veterinary Chatbot SDK - Submission

## 🚀 Overview
This repository contains a full-stack Veterinary Chatbot SDK built with the MERN stack (MongoDB, Express, React, Node.js). It features an embeddable chat widget, AI-powered veterinary Q&A, and a conversational appointment booking system.

## 🛠 Tech Stack
- **Frontend**: React, Vite, Tailwind CSS (Custom Styling)
- **Backend**: Node.js, Express
- **Database**: MongoDB (Atlas)
- **AI**: Google Gemini API (optimized to reduce quota usage)

## ✅ Key Features Implemented
1.  **Embeddable SDK**: The chatbot can be added to any site via a simple script tag.
2.  **Optimized Booking Flow**:
    -   Uses **Regex-first intent detection** to instantly recognize booking requests without wasting AI tokens.
    -   **Zero-AI Slot Filling**: Once in the booking flow, the system uses deterministic logic to collect Name, Pet Name, Phone, and Time. This ensures the booking process **never fails** due to AI hallucinations or API errors.
3.  **AI Veterinary Assistant**: Responds to generic pet health questions using Google Gemini.
4.  **Robust Error Handling**: Graceful fallbacks if AI services are down.

## 🏃‍♂️ How to Run Locally

### 1. Backend
```bash
cd backend
npm install
npm start
```
*Server runs on port 4000.*

### 2. Frontend
```bash
cd frontend/vet-chatbot-ui
npm install
npm run dev
```
*UI runs on http://localhost:5173.*

## 🚀 Deployment Instructions (Render)
This repository is configured for effortless deployment on Render (or any Node.js platform).

1.  **Push to GitHub**:
    ```bash
    git add .
    git commit -m "Final submission: Ready for deploy"
    git push origin main
    ```
2.  **Render Configuration**:
    -   **Root Directory**: `.` (Root)
    -   **Build Command**: `npm install && npm run build` (This runs the script in root package.json which builds frontend & moves it to backend)
    -   **Start Command**: `npm start --prefix backend`

**Verification:**
After deployment, your live URL will serve:
-   `/` -> The Landing Page (Chatbot UI)
-   `/admin` -> The Admin Dashboard
-   `/api/*` -> The Backend APIs

## 🧪 Verified Test Flow
The following flow has been rigorously tested and verified:
1.  **User**: "Book an appointment"
    -   *System detects intent locally.*
2.  **Bot**: "I can help you schedule an appointment. First, what is your name?"
3.  **User**: "Rohit"
4.  **Bot**: "What is your pet’s name?"
5.  **User**: "Sheru"
6.  **Bot**: "Please share your phone number."
7.  **User**: "555-0199"
8.  **Bot**: "What date and time would you prefer...?"
9.  **User**: "Tomorrow 10am"
10. **Bot**: Asks for confirmation.
11. **User**: "Yes" -> **Booking Saved to MongoDB**.

## 📂 Architecture Decisions
-   **Separation of Concerns**: Controllers handle logic, Services handle AI integration.
-   **State Management**: Chat session state (draft appointments) is persisted in MongoDB, allowing users to pause and resume.
-   **Cost Optimization**: The system prioritizes rule-based logic for structured tasks (booking) and uses LLMs only for unstructured tasks (advice).

## 🔮 Future Improvements
-   Add authentication for Vet Admin Dashboard.
-   Implement WebSocket for real-time typing indicators.
