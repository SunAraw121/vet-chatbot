import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Import controller logic
import { handleChat, getConversationHistory, getAppointments } from "./controllers/chat.controller.js";

const app = express();

/* ---------- Middleware ---------- */
app.use(express.json());

// 1. Standard CORS Middleware (for GET/POST)
app.use(cors({
  origin: [
    "https://vet-chatbot.vercel.app",
    "https://vet-chatbot-server.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 2. 🔑 HARD STOP for preflight (OPTIONS)
// This guarantees that OPTIONS requests get headers and a 204 immediately,
// bypassing any potential interference.
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    const origin = req.headers.origin;
    // Allow explicitly listed origins or fallback to *
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.sendStatus(204);
  }
  next();
});

/* ---------- Routes ---------- */
app.get("/", (req, res) => {
  res.json({ status: "OK", service: "vet-chatbot-backend" });
});

app.post("/api/chat", handleChat);
app.get("/api/conversations/:sessionId", getConversationHistory);
app.get("/api/appointments", getAppointments);

/* ---------- Start Server ---------- */
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI || "")
  .then(() => console.log("✅ DB Connected"))
  .catch(err => console.error("❌ DB Error:", err.message));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
