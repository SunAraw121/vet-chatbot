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

// Standard CORS Configuration
app.use(cors({
  origin: [
    "https://vet-chatbot.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173" // Vite default
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// � THE MISSING PIECE: Handle Preflight Requests explicitly
app.options("*", cors());

/* ---------- Routes ---------- */
app.get("/", (req, res) => {
  res.json({ status: "OK", service: "vet-chatbot-backend" });
});

// Restore standard API routings
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
