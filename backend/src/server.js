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
 * 💥 ABSOLUTE PRIORITY LOGGING & CORS
 * Defined before ANY other middleware.
 */
app.use((req, res, next) => {
  console.log(`🔥 [HIT] ${req.method} ${req.url}`);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("X-Backend-Server", "Veterinary-Chatbot-Final-Fix");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());

/**
 * 📍 EMERGENCY TOP-LEVEL ROUTES
 * These are defined before static files to prevent hijacking.
 */
app.get("/ping", (req, res) => res.json({ status: "ok", message: "pong" }));

app.get("/chat-check", (req, res) => {
  res.json({ status: "Visible at root level", timestamp: new Date().toISOString() });
});

app.post("/chat", handleChat);

// The original root
app.get("/", (req, res) => {
  res.json({ status: "alive", note: "Root is active" });
});

/**
 * 📍 BACKWARD COMPAT (Just in case)
 */
app.use("/api/chat", handleChat);
app.get("/api/chat-check", (req, res) => res.json({ status: "API path active" }));

/**
 * 📍 STATIC ASSETS
 */
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));

/**
 * 📍 GLOBAL 404 & ERROR
 */
app.use((req, res) => {
  console.log(`❌ [404] ${req.url}`);
  res.status(404).json({ error: "Express Route Not Found", url: req.url });
});

app.use((err, req, res, next) => {
  console.error("📛 SERVER ERROR:", err.message);
  res.status(500).json({ error: "Internal Error", detail: err.message });
});

/**
 * 📍 BOOT
 */
const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI || "")
  .then(() => console.log("✅ Database Connected"))
  .catch(err => console.error("❌ Database Error:", err.message));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 [READY] Production server listening on port ${PORT}`);
});
