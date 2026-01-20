import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import controller logic
import { handleChat, getConversationHistory, getAppointments } from "./controllers/chat.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

// 1. Standard CORS Middleware
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

// 2. Preflight Handlers
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    const origin = req.headers.origin;
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.sendStatus(204);
  }
  next();
});

// 3. Serve Static Files from public folder (IMPORTANT for Render/Local Demo)
app.use(express.static(path.join(__dirname, "../public")));

/* ---------- API Routes ---------- */
app.post("/api/chat", handleChat);
app.get("/api/conversations/:sessionId", getConversationHistory);
app.get("/api/appointments", getAppointments);

// Health check specifically on /api/health to avoid root conflict
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", service: "vet-chatbot-backend" });
});

/* ---------- SPA Routing ---------- */
// This ensures that refreshing on /admin (or any other route) serves the React App
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API route not found" });
  }
  res.sendFile(path.resolve(__dirname, "../public/index.html"));
});

/* ---------- Start Server ---------- */
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI || "")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err.message));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🏠 Static files served from: ${path.join(__dirname, "../public")}`);
});
