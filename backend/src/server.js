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
 * 0. GLOBAL LOGGER & CORS
 * We must use manual headers to be 100% sure they are sent.
 */
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

/**
 * 1. ROOT ROUTES (Skip the /api prefix entirely for Render stability)
 */
app.get("/", (req, res) => {
  res.json({ status: "alive", message: "Production Backend" });
});

// THIS IS THE MAIN ENDPOINT NOW
app.post("/chat", handleChat);

// Debug route to Verify path visibility
app.get("/chat-check", (req, res) => {
  res.json({ status: "Chat path is visible and active" });
});

/**
 * 2. BACKWARD COMPAT (Keep /api just in case, but frontend will use root)
 */
app.post("/api/chat", handleChat);
app.get("/api/conversations/:sessionId", getConversationHistory);
app.get("/api/appointments", getAppointments);

/**
 * 3. STATIC FILES
 */
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));

/**
 * 4. DB & BOOT
 */
const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI || "").then(() => {
  console.log("✅ DB Connected");
}).catch(err => console.error("❌ DB Error:", err.message));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server on port ${PORT}`);
});
