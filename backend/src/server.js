import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Imports
import {
  handleChat,
  getConversationHistory,
  getAppointments
} from "./controllers/chat.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * 0. ABSOLUTE FIRST LOGGER
 * This logs every request before any other logic.
 * If a request doesn't show up here, it's NOT reaching the app.
 */
app.use((req, res, next) => {
  console.log(`📡 [INCOMING] ${new Date().toISOString()} | ${req.method} ${req.url} | Origin: ${req.headers.origin}`);
  next();
});

/**
 * 1. MANUAL AGGRESSIVE CORS
 * Explicitly allows everything for debugging.
 */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  // Intercept OPTIONS preflight
  if (req.method === "OPTIONS") {
    console.log(`   └─ Preflight OPTIONS handled for ${req.url}`);
    return res.status(200).send();
  }
  next();
});

app.use(express.json());

// 2. HEALTH CHECK (ROOT)
app.get("/", (req, res) => {
  res.json({
    status: "alive",
    message: "Veterinary Chatbot Backend is running",
    debug: "Consolidated Version 2.0"
  });
});

/**
 * 3. API ROUTES (Explicitly defined)
 */
// GET test route for browser verification
app.get("/api/chat", (req, res) => {
  console.log("   └─ Processing GET /api/chat");
  res.json({ status: "Chat API reachable", note: "Use POST for actual chat" });
});

// Main chat POST route
app.post("/api/chat", (req, res, next) => {
  console.log("   └─ Processing POST /api/chat");
  next();
}, handleChat);

app.get("/api/conversations/:sessionId", getConversationHistory);
app.get("/api/appointments", getAppointments);

/**
 * 4. STATIC FILES (SDK)
 */
const publicPath = path.resolve(__dirname, "..", "public");
app.use(express.static(publicPath));

/**
 * 5. CATCH-ALL 404
 * If no previous route matched, log it and return JSON.
 */
app.use((req, res) => {
  console.log(`🚨 [404] No route found for: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Route not found in Express", path: req.url });
});

/**
 * 6. DB & START
 */
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI || "").then(() => {
  console.log("✅ MongoDB Connected");
}).catch(err => {
  console.error("❌ MongoDB Error:", err.message);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server fully operational on port ${PORT}`);
  console.log(`📂 Serving static files from: ${publicPath}`);
});
