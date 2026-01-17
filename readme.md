# Veterinary Chatbot SDK

A production-ready, website-integrable chatbot SDK for veterinary questions and appointment booking, built with the MERN stack and Google Gemini API.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd vet-chatbot
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   MONGO_URI=your_mongodb_connection_string_here
   ```

   **Important**: Use Gemini 2.x models (e.g., `gemini-2.5-flash`). The older 1.5 models are deprecated.

4. **Get a Gemini API Key**
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Click "Get API Key"
   - Create a new key or use an existing one
   - Copy and paste into `.env`

5. **Start the backend server**
   ```bash
   npm start
   ```

6. **Test the chatbot**
   
   Open your browser and navigate to:
   ```
   http://localhost:4000/test.html
   ```

## 📦 SDK Integration

### Basic Integration
Add this single script tag to any website:

```html
<script src="http://localhost:4000/chatbot.js"></script>
```

### With Context (Optional)
Pass contextual information to personalize the experience:

```html
<script>
  window.VetChatbotConfig = {
    userId: "user_123",
    userName: "John Doe",
    petName: "Buddy",
    source: "marketing-website"
  };
</script>
<script src="http://localhost:4000/chatbot.js"></script>
```

## 🏗️ Architecture Overview

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                      Website (Any HTML)                      │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ <script src="chatbot.js">
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   SDK Loader (chatbot.js)                    │
│  • Generates/retrieves session ID                            │
│  • Injects React bundle                                      │
│  • Passes config to React app                                │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ Loads React Bundle
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              React Widget (Chat UI Components)               │
│  • ChatWidget.jsx (floating button)                          │
│  • ChatWindow.jsx (chat interface)                           │
│  • api.js (backend communication)                            │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ POST /api/chat
                            │ GET /api/conversations/:sessionId
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express Backend (Node.js)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes (chat.routes.js)                             │   │
│  │    ↓                                                  │   │
│  │  Controllers (chat.controller.js)                    │   │
│  │    • handleChat() - Main chat logic                  │   │
│  │    • getConversationHistory() - Fetch history        │   │
│  │    ↓                                                  │   │
│  │  Services (gemini.service.js)                        │   │
│  │    • getVetAIResponse() - AI integration             │   │
│  │    ↓                                                  │   │
│  │  Utils                                                │   │
│  │    • intentDetector.js - Classify user intent        │   │
│  │    • appointmentFlow.js - Booking flow logic         │   │
│  │    ↓                                                  │   │
│  │  Models (Mongoose schemas)                           │   │
│  │    • Session.js - Conversation state                 │   │
│  │    • Appointment.js - Booked appointments            │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────┬───────────────────────┬─────────────────────┘
                │                       │
                │ AI Requests           │ Data Persistence
                ▼                       ▼
    ┌──────────────────┐    ┌──────────────────────┐
    │   Google Gemini  │    │      MongoDB         │
    │   (2.5-flash)    │    │  • sessions          │
    │                  │    │  • appointments      │
    └──────────────────┘    └──────────────────────┘
```

### Tech Stack
- **Frontend**: React 18 + Vite
- **Backend**: Node.js 20 + Express 4
- **Database**: MongoDB (Mongoose ODM)
- **AI**: Google Gemini API 2.5 Flash
- **Deployment**: Static serving from Express

## 🎯 Features

### 1. AI-Powered Veterinary Q&A ✅
- Answers generic veterinary questions using Gemini 2.5 Flash
- Topics: pet care, vaccinations, diet, common illnesses, preventive care
- Politely declines non-veterinary questions
- Uses system prompts to enforce boundaries
- Maintains conversation context

### 2. Conversational Appointment Booking ✅
- Natural language intent detection
- Slot-filling conversation flow
- Collects: owner name, pet name, phone, preferred date/time
- Basic input validation (phone number length)
- Confirmation step before saving
- Restart capability at any point ("NO" or "restart")
- Stores appointments in MongoDB

### 3. Data Persistence ✅
- All conversations stored in MongoDB with timestamps
- Appointments linked to sessions
- Session management with localStorage
- Optional context data from SDK config
- Conversation history API endpoint

### 4. SDK Integration ✅
- Single script tag integration
- Automatic floating widget rendering
- Optional configuration object
- Session persistence across page reloads
- Built React bundle served statically

## 📁 Project Structure

```
vet-chatbot/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── chat.controller.js        # Main chat logic + history API
│   │   ├── models/
│   │   │   ├── Session.js                # Conversation schema
│   │   │   └── Appointment.js            # Appointment schema
│   │   ├── routes/
│   │   │   └── chat.routes.js            # API routes
│   │   ├── services/
│   │   │   └── gemini.service.js         # AI integration (Gemini 2.5)
│   │   ├── utils/
│   │   │   ├── intentDetector.js         # Intent classification
│   │   │   └── appointmentFlow.js        # Booking flow logic
│   │   └── server.js                     # Express app
│   ├── public/
│   │   ├── chatbot.js                    # SDK loader script
│   │   ├── test.html                     # Demo page
│   │   └── assets/                       # Built React bundle
│   ├── package.json
│   └── .env                              # Environment variables
├── frontend/
│   └── vet-chatbot-ui/
│       ├── src/
│       │   ├── App.jsx                   # Root component
│       │   ├── ChatWidget.jsx            # Floating button
│       │   ├── ChatWindow.jsx            # Chat interface
│       │   ├── api.js                    # Backend API calls
│       │   └── main.jsx                  # Entry point
│       ├── vite.config.js                # Build configuration
│       └── package.json
├── README.md
├── .env.example
└── FINAL_STATUS.md
```

## 🔑 Key Design Decisions

### 1. Architecture Pattern: Layered Architecture
- **Routes**: Handle HTTP requests/responses
- **Controllers**: Business logic and orchestration
- **Services**: External API integration (Gemini)
- **Utils**: Reusable helper functions
- **Models**: Data schemas and database interaction

**Why**: Clear separation of concerns, easy to test, maintainable

### 2. State Management: Session-Based
- Each conversation has a unique `sessionId`
- State stored in MongoDB (not in-memory)
- Allows horizontal scaling
- Survives server restarts

**Why**: Production-ready, scalable, persistent

### 3. Intent Detection: Keyword-Based
- Simple keyword matching for appointment booking
- Falls back to AI for general queries

**Why**: Fast, predictable, sufficient for this use case. Could be upgraded to ML-based classification later.

### 4. Slot-Filling Pattern for Appointments
- Ask for one piece of information at a time
- Store partial data in `appointmentDraft`
- Validate before moving to next slot
- Confirm before final save

**Why**: Natural conversation flow, handles errors gracefully

### 5. SDK Delivery: Pre-built Bundle
- React app built ahead of time
- Served as static files
- Single script tag loads everything

**Why**: Fast loading, works on any website, no build step for integrators

## 🧪 Testing

### Manual Testing Checklist

**Appointment Booking (Happy Path)**
```
✅ User: "I want to book an appointment"
✅ Bot: "Sure! Let's get your appointment set up. What is your name?"
✅ User: "Sarah"
✅ Bot: "Great, Sarah! What is your pet's name?"
✅ User: "Max"
✅ Bot: "What is your phone number?"
✅ User: "1234567890"
✅ Bot: "When would you prefer for the appointment?"
✅ User: "Tomorrow at 3pm"
✅ Bot: [Shows confirmation]
✅ User: "YES"
✅ Bot: "✅ Your appointment has been booked successfully!"
```

**Appointment Restart**
```
✅ User: "I want to book an appointment"
✅ Bot: "What is your name?"
✅ User: "restart"
✅ Bot: "Let's start over. What is your name?"
```

**Veterinary Q&A**
```
✅ User: "How should I feed my kitten?"
✅ Bot: [Provides detailed veterinary advice]
```

**Off-Topic Handling**
```
✅ User: "What's the weather today?"
✅ Bot: "I'm sorry, but I can only help with veterinary-related questions..."
```

### API Testing

**Test Gemini Integration**
```bash
cd backend
node test-correct-model.js
```

**Test Conversation History API**
```bash
curl http://localhost:4000/api/conversations/<sessionId>
```

## 🚧 Known Limitations & Assumptions

### Assumptions Made
1. **Phone Validation**: Basic length check (10+ digits). Doesn't validate format or country codes.
2. **Date/Time Parsing**: Stores user input as-is. No date parsing or validation.
3. **Single Language**: English only.
4. **No Authentication**: Anyone can use the chatbot.
5. **No Rate Limiting**: Could be abused in production.
6. **Session Cleanup**: Old sessions are not automatically deleted.

### Known Limitations
1. **Intent Detection**: Uses simple keyword matching, not ML-based.
2. **Validation**: Basic input validation only.
3. **Error Recovery**: Limited error recovery in conversation flow.
4. **Scalability**: Single server deployment (no load balancing).
5. **Security**: No input sanitization, XSS protection, or CSRF tokens.

## 🔮 Future Improvements

### High Priority
- [ ] Add proper phone number validation (regex, country codes)
- [ ] Implement date/time parsing and validation
- [ ] Add conversation history API endpoint ✅ (COMPLETED)
- [ ] Create admin dashboard for viewing appointments
- [ ] Add input sanitization and XSS protection

### Medium Priority
- [ ] Implement user authentication
- [ ] Add rate limiting
- [ ] Support multiple languages
- [ ] ML-based intent classification
- [ ] Email/SMS confirmation for appointments
- [ ] Calendar integration

### Low Priority
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Performance monitoring
- [ ] Analytics dashboard

## 🤝 Use of AI Tools

This project was built with assistance from AI coding tools (Claude). Here's how AI was used:

### What AI Helped With
1. **Initial Scaffolding**: Project structure and boilerplate code
2. **Debugging**: Identifying the Gemini model version issue (1.5 → 2.5)
3. **API Integration**: Gemini service implementation
4. **Documentation**: README and code comments
5. **Bug Fixes**: Appointment flow logic (name-skipping bug)

### What I Understood and Adapted
1. **Model Migration**: Learned that Gemini 1.5 models are deprecated, migrated to 2.5
2. **SDK Versioning**: Upgraded `@google/generative-ai` to v0.24.1
3. **State Management**: Understood the session-based architecture
4. **Slot-Filling Pattern**: Adapted the conversational flow logic
5. **Error Handling**: Added graceful fallbacks throughout

### Engineering Judgment Applied
1. **Chose session-based state** over in-memory for scalability
2. **Used keyword-based intent detection** for simplicity and speed
3. **Implemented basic validation** as specified (not over-engineered)
4. **Prioritized working features** over perfect code
5. **Documented assumptions** clearly

## 📊 Assignment Compliance

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| **SDK Integration** | ✅ Complete | Single script tag, optional config |
| **Floating Widget** | ✅ Complete | Bottom-right, expandable/collapsible |
| **Chat History View** | ✅ Complete | All messages displayed |
| **Loading Indicator** | ✅ Complete | Shows while waiting for response |
| **Error Fallback** | ✅ Complete | Graceful error messages |
| **AI Veterinary Q&A** | ✅ Complete | Gemini 2.5 Flash with system prompts |
| **Off-Topic Handling** | ✅ Complete | Politely declines |
| **Appointment Booking** | ✅ Complete | Conversational slot-filling |
| **Input Validation** | ✅ Complete | Basic phone validation |
| **Confirmation Step** | ✅ Complete | YES/NO before saving |
| **MongoDB Persistence** | ✅ Complete | Sessions & appointments |
| **Conversation History API** | ✅ Complete | GET /api/conversations/:sessionId |
| **Clean Architecture** | ✅ Complete | Layered architecture |
| **Error Handling** | ✅ Complete | Try-catch blocks, fallbacks |
| **Environment Variables** | ✅ Complete | .env file with .env.example |
| **Documentation** | ✅ Complete | Comprehensive README |

## 📄 License

MIT

## 👤 Author

Rohit Jangid

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- MongoDB Atlas for database hosting
- React and Vite for frontend tooling
- Claude AI for development assistance
