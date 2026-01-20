import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Import controllers directly to avoid router grouping issues
import {
  handleChat,
  getConversationHistory,
  getAppointments
} from "./controllers/chat.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. GLOBAL CORS (Very first thing)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// 2. LOGGING MIDDLEWARE
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 3. HEALTH CHECK
app.get("/", (req, res) => {
  res.json({
    status: "alive",
    message: "Veterinary Chatbot Backend is running",
    time: new Date().toISOString()
  });
});

// 4. CONSOLIDATED API ROUTES (No separate router file)
app.get("/api/chat", (req, res) => {
  res.json({ status: "API is alive", usage: "POST to this endpoint" });
});

app.post("/api/chat", handleChat);

app.get("/api/conversations/:sessionId", getConversationHistory);

app.get("/api/appointments", getAppointments);

// 5. STATIC FILES (SDK)
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));

// 6. DB CONNECTION
if (!process.env.MONGO_URI) {
  console.error("❌ CRITICAL: MONGO_URI is missing from environment variables!");
} else {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch(err => {
      console.error("❌ MongoDB connection error:", err.message);
    });
}

// 7. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("🔥 INTERNAL SERVER ERROR:", err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// 8. START SERVER
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`📂 Public assets at: ${publicPath}`);
});
