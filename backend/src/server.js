import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";

// Import controller
import { handleChat } from "./controllers/chat.controller.js";

const app = express();

/**
 * 💥 THE ABSOLUTE FIRST LINE
 * We handle CORS and Logging before ANYTHING else.
 */
app.use((req, res, next) => {
  console.log(`📡 [EXFILTRATION] ${req.method} ${req.url}`);

  // Aggressive CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("X-Debug-Exfiltrated", "TRUE"); // To verify in your console

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());

/**
 * 🚀 THE BYPASS
 * We map the CHAT logic directly to the ROOT.
 * Render allows '/', so we will use '/' for everything.
 */

// If it's a POST to '/', it's a message
app.post("/", handleChat);

// If it's a GET to '/', it's a health check
app.get("/", (req, res) => {
  res.json({
    status: "READY",
    mode: "Exfiltration-Root-Bypass",
    note: "Send POST requests to this exact URL for chat"
  });
});

// Backward compatibility (just in case Render starts working normally)
app.post("/chat", handleChat);
app.post("/api/chat", handleChat);

// Start
const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI || "").then(() => {
  console.log("✅ Database Connected");
}).catch(err => console.error("❌ DB Error", err.message));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 BYPASS SERVER LIVE ON PORT ${PORT}`);
});
