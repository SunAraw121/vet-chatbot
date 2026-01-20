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
 */
app.use((req, res, next) => {
  console.log(`📡 [INCOMING] ${req.method} ${req.url} | Origin: ${req.headers.origin}`);
  next();
});

/**
 * 1. MANUAL CORS
 */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());

// 2. HEALTH CHECK
app.get("/", (req, res) => {
  res.json({ status: "alive", message: "Backend is running", version: "ShadowRoute-Alpha" });
});

/**
 * 3. SHADOW ROUTES (Bypassing Render's potential /api path blocks)
 */
app.get("/chat-test", (req, res) => {
  res.json({ status: "Shadow route /chat-test is ACTIVE" });
});

app.post("/chat", handleChat); // No /api prefix

/**
 * 4. STANDARD API ROUTES
 */
app.get("/api/chat-test", (req, res) => {
  res.json({ status: "API route /api/chat-test is ACTIVE" });
});
app.post("/api/chat", handleChat);
app.get("/api/conversations/:sessionId", getConversationHistory);
app.get("/api/appointments", getAppointments);

// 5. STATIC FILES
const publicPath = path.resolve(__dirname, "..", "public");
app.use(express.static(publicPath));

// 6. CATCH-ALL
app.use((req, res) => {
  console.log(`🚨 [404] No match for: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Express 404", path: req.url });
});

// Start
const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI || "").then(() => {
  console.log("✅ MongoDB Connected");
}).catch(err => console.error("❌ DB Error:", err.message));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server on port ${PORT}`);
});
