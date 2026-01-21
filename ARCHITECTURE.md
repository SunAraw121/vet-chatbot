# Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Website Integration Layer                     │
│                                                                   │
│  Any HTML Page:                                                   │
│  <script>                                                         │
│    window.VetChatbotConfig = { userId, userName, petName };      │
│  </script>                                                        │
│  <script src="http://localhost:4000/chatbot.js"></script>        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ 1. Load SDK Script
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SDK Loader (chatbot.js)                     │
│                                                                   │
│  • Generate/retrieve sessionId (localStorage)                    │
│  • Read window.VetChatbotConfig                                  │
│  • Create root div for React app                                 │
│  • Inject React bundle (index.js + index.css)                    │
│  • Pass sessionId + context to React via window.__VET_CHATBOT_DATA__ │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ 2. Initialize React App
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (React Components)                   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  main.jsx                                                │    │
│  │    • Read window.__VET_CHATBOT_DATA__                    │    │
│  │    • Render <App sessionId={...} context={...} />        │    │
│  └─────────────────────────┬───────────────────────────────┘    │
│                            │                                     │
│  ┌─────────────────────────▼───────────────────────────────┐    │
│  │  App.jsx                                                 │    │
│  │    • Pass props to ChatWidget                            │    │
│  └─────────────────────────┬───────────────────────────────┘    │
│                            │                                     │
│  ┌─────────────────────────▼───────────────────────────────┐    │
│  │  ChatWidget.jsx                                          │    │
│  │    • Floating button (bottom-right)                      │    │
│  │    • Toggle open/close state                             │    │
│  │    • Render ChatWindow when open                         │    │
│  └─────────────────────────┬───────────────────────────────┘    │
│                            │                                     │
│  ┌─────────────────────────▼───────────────────────────────┐    │
│  │  ChatWindow.jsx                                          │    │
│  │    • Display messages                                    │    │
│  │    • Input field + send button                           │    │
│  │    • Loading indicator                                   │    │
│  │    • Error handling                                      │    │
│  │    • Calls api.sendMessage()                             │    │
│  └─────────────────────────┬───────────────────────────────┘    │
│                            │                                     │
│  ┌─────────────────────────▼───────────────────────────────┐    │
│  │  api.js                                                  │    │
│  │    • sendMessage(sessionId, message, context)            │    │
│  │    • POST /api/chat                                      │    │
│  └─────────────────────────┬───────────────────────────────┘    │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             │ 3. HTTP Request
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Express Server)                      │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  server.js                                               │    │
│  │    • Initialize Express app                              │    │
│  │    • Connect to MongoDB                                  │    │
│  │    • Serve static files (public/)                        │    │
│  │    • Mount routes (/api)                                 │    │
│  └─────────────────────────┬───────────────────────────────┘    │
│                            │                                     │
│  ┌─────────────────────────▼───────────────────────────────┐    │
│  │  routes/chat.routes.js                                   │    │
│  │    • POST /api/chat → handleChat()                       │    │
│  │    • GET /api/conversations/:id → getConversationHistory()│   │
│  └─────────────────────────┬───────────────────────────────┘    │
│                            │                                     │
│  ┌─────────────────────────▼───────────────────────────────┐    │
│  │  controllers/chat.controller.js                          │    │
│  │                                                           │    │
│  │  handleChat():                                            │    │
│  │    1. Validate request (sessionId, message)              │    │
│  │    2. Find/create session in MongoDB                     │    │
│  │    3. Store user message                                 │    │
│  │    4. Detect intent (BOOK_APPOINTMENT or GENERAL_QUERY)  │    │
│  │    5. Handle appointment booking flow (if applicable)    │    │
│  │    6. Call AI service for general queries                │    │
│  │    7. Store bot response                                 │    │
│  │    8. Return response to frontend                        │    │
│  │                                                           │    │
│  │  getConversationHistory():                               │    │
│  │    1. Validate sessionId                                 │    │
│  │    2. Fetch session from MongoDB                         │    │
│  │    3. Return messages + metadata                         │    │
│  └─────────────────────────┬───────────────────────────────┘    │
│                            │                                     │
│  ┌─────────────────────────▼───────────────────────────────┐    │
│  │  utils/intentDetector.js                                 │    │
│  │    • detectIntent(message)                               │    │
│  │    • Keyword matching for "book", "appointment", etc.    │    │
│  │    • Returns: BOOK_APPOINTMENT | GENERAL_QUERY           │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  utils/appointmentFlow.js                                │    │
│  │    • getNextAppointmentQuestion(draft)                   │    │
│  │    • Determines which field to ask for next              │    │
│  │    • Returns appropriate question string                 │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  services/gemini.service.js                              │    │
│  │    • getVetAIResponse(message, history)                  │    │
│  │    • Initialize GoogleGenerativeAI                       │    │
│  │    • Use model: "gemini-2.5-flash"                       │    │
│  │    • Apply system prompt (vet-only)                      │    │
│  │    • Send message with conversation history              │    │
│  │    • Return AI response                                  │    │
│  └─────────────────────────┬───────────────────────────────┘    │
│                            │                                     │
│  ┌─────────────────────────▼───────────────────────────────┐    │
│  │  models/Session.js                                       │    │
│  │    Schema:                                                │    │
│  │      • sessionId (String, unique)                        │    │
│  │      • context (Object, optional)                        │    │
│  │      • messages [{role, content, timestamp}]             │    │
│  │      • appointmentDraft (Object)                         │    │
│  │      • lastIntent (String)                               │    │
│  │      • createdAt, updatedAt (Timestamps)                 │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  models/Appointment.js                                   │    │
│  │    Schema:                                                │    │
│  │      • sessionId (String)                                │    │
│  │      • ownerName (String)                                │    │
│  │      • petName (String)                                  │    │
│  │      • phone (String)                                    │    │
│  │      • datetime (String)                                 │    │
│  │      • createdAt (Timestamp)                             │    │
│  └──────────────────────────────────────────────────────────┘    │
└────────────┬──────────────────────────┬───────────────────────────┘
             │                          │
             │ 4. AI Request            │ 5. Database Operations
             ▼                          ▼
┌──────────────────────┐    ┌──────────────────────────────┐
│   Google Gemini API  │    │         MongoDB              │
│                      │    │                              │
│  Model:              │    │  Collections:                │
│  gemini-2.5-flash    │    │    • sessions                │
│                      │    │    • appointments            │
│  Features:           │    │                              │
│  • System prompts    │    │  Operations:                 │
│  • Conversation      │    │    • findOne()               │
│    history           │    │    • save()                  │
│  • Streaming         │    │    • create()                │
│    (not used)        │    │                              │
└──────────────────────┘    └──────────────────────────────┘
```

## Data Flow

### 1. User Sends Message

```
User types "I want to book an appointment"
  ↓
ChatWindow.handleSend()
  ↓
api.sendMessage(sessionId, message, context)
  ↓
POST /api/chat { sessionId, message, context }
  ↓
Backend receives request
```

### 2. Backend Processing

```
chat.controller.handleChat()
  ↓
1. Validate request
  ↓
2. Find/create session in MongoDB
  ↓
3. Store user message in session.messages
  ↓
4. Detect intent using intentDetector.detectIntent()
  ↓
5a. If BOOK_APPOINTMENT:
    • Check if all slots filled
    • If not, ask for next missing field
    • If yes, show confirmation
    • On "YES", save to Appointment collection
  ↓
5b. If GENERAL_QUERY:
    • Call gemini.service.getVetAIResponse()
    • Pass conversation history for context
    • Get AI response
  ↓
6. Store bot response in session.messages
  ↓
7. Save session to MongoDB
  ↓
8. Return { reply, sessionId } to frontend
```

### 3. Frontend Updates

```
Backend responds with { reply, sessionId }
  ↓
api.sendMessage() resolves
  ↓
ChatWindow updates messages state
  ↓
New message appears in chat
  ↓
User sees bot response
```

## State Management

### Session State (MongoDB)

```javascript
{
  sessionId: "uuid-v4",
  context: {
    userId: "user_123",
    userName: "John Doe",
    petName: "Buddy",
    source: "marketing-website"
  },
  messages: [
    { role: "user", content: "Hello", timestamp: Date },
    { role: "bot", content: "Hi! How can I help?", timestamp: Date }
  ],
  appointmentDraft: {
    ownerName: "Sarah",
    petName: "Max",
    phone: "1234567890",
    datetime: null  // Still collecting
  },
  lastIntent: "BOOK_APPOINTMENT",
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment State (MongoDB)

```javascript
{
  sessionId: "uuid-v4",
  ownerName: "Sarah",
  petName: "Max",
  phone: "1234567890",
  datetime: "Tomorrow at 3pm",
  createdAt: Date
}
```

## Key Design Patterns

### 1. Layered Architecture
- **Presentation**: React components
- **API**: Express routes
- **Business Logic**: Controllers
- **Data Access**: Mongoose models
- **External Services**: Gemini service

### 2. Dependency Injection
- Services injected into controllers
- Models injected into controllers
- Easy to mock for testing

### 3. State Machine (Appointment Flow)
```
GENERAL_QUERY
  ↓ (user says "book appointment")
BOOK_APPOINTMENT
  ↓
ASK_OWNER_NAME → ASK_PET_NAME → ASK_PHONE → ASK_DATETIME
  ↓
CONFIRM
  ↓ (user says "YES")
SAVE_APPOINTMENT
  ↓
GENERAL_QUERY
```

### 4. Slot-Filling Pattern
```
appointmentDraft = {
  ownerName: null,
  petName: null,
  phone: null,
  datetime: null
}

For each message:
  1. Check which slots are empty
  2. Ask for the first empty slot
  3. Store user's response in that slot
  4. Repeat until all slots filled
  5. Show confirmation
  6. Save on "YES"
```

## Security Considerations

### Current Implementation
- ✅ Environment variables for secrets
- ✅ CORS enabled (configurable)
- ✅ MongoDB connection string not exposed
- ✅ Error messages don't leak sensitive info

### Not Implemented (Future)
- ❌ Input sanitization
- ❌ XSS protection
- ❌ CSRF tokens
- ❌ Rate limiting
- ❌ Authentication
- ❌ Authorization

## Scalability Considerations

### Current Design
- ✅ Stateless backend (state in MongoDB)
- ✅ Horizontal scaling ready
- ✅ Session-based (not in-memory)

### Future Improvements
- Load balancer
- Redis for session caching
- Message queue for async processing
- CDN for static assets
- Database read replicas
