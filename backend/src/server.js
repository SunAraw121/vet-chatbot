import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";

// Import controller logic
import { handleChat } from "./controllers/chat.controller.js";

const app = express();

/**
 * 💥 GHOST PROTOCOL CORS
 */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.json());

/**
 * 🚀 GHOST PROTOCOL ROUTING (GET BYPASS)
 * Since POST preflights are being blocked, we use GET for everything.
 */

// 1. Production Chat (GET)
// This decodes the message from the URL to avoid the Preflight/OPTIONS failure.
app.get("/chat", async (req, res) => {
  console.log(`📡 [GHOST-GET] Received data: ${req.query.data}`);
  try {
    const rawData = req.query.data;
    const { sessionId, message, context } = JSON.parse(decodeURIComponent(rawData));

    // Inject into body for the existing controller to work
    req.body = { sessionId, message, context };
    return handleChat(req, res);
  } catch (err) {
    console.error("📛 Decode Error:", err.message);
    res.status(400).json({ error: "Invalid data format" });
  }
});

// 2. Health Check
app.get("/", (req, res) => {
  res.json({
    status: "GHOST_PROTOCOL_ACTIVE",
    note: "Use GET /chat?data=... for communication"
  });
});

// Backward compatibility (Keep these just in case)
app.post("/", handleChat);
app.post("/chat", handleChat);

// Start
const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI || "")
  .then(() => console.log("✅ DB Connected"))
  .catch(err => console.error("❌ DB Error", err.message));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 [GHOST] Listening on port ${PORT}`);
});
