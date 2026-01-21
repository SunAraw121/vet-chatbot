import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import fetch from "node-fetch";

if (!global.fetch) {
  global.fetch = fetch;
  global.Headers = fetch.Headers;
  global.Request = fetch.Request;
  global.Response = fetch.Response;
}

// Verification log for environment variables
console.log("🛠️  [ENV CHECK] MONGO_URI:", process.env.MONGO_URI ? "PRESET ✅" : "MISSING ❌");
console.log("🛠️  [ENV CHECK] GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "PRESET ✅" : "MISSING ❌");

// Import controller logic
import { handleChat, getConversationHistory, getAppointments } from "./controllers/chat.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("-----------------------------------------");
console.log("🚀 DR PAW BACKEND (v2.0.FINAL) STARTING...");
console.log("-----------------------------------------");

const app = express();

app.use(express.json());

// 1. Precise CORS Configuration
app.use(cors({
  origin: true, // Allow all origins during final debug to ensure connectivity
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 2. Hard Stop for OPTIONS (Preflight)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.sendStatus(204);
  }
  next();
});

// 3. API Routes first to avoid static file interference
app.post("/api/chat", (req, res, next) => {
  console.log(`📩 Received Chat Request: ${req.body?.message?.substring(0, 50)}`);
  next();
}, handleChat);

app.get("/api/conversations/:sessionId", getConversationHistory);
app.get("/api/appointments", getAppointments);

// Test AI Endpoint
app.get("/api/test-ai", async (req, res) => {
  try {
    const { detectIntentWithAI, getVetAIResponse } = await import("./services/gemini.service.js");
    const intent = await detectIntentWithAI("hello");
    const response = await getVetAIResponse("Hi Dr. Paw", []);
    res.json({ status: "SUCCESS", intent, response });
  } catch (error) {
    res.status(500).json({
      status: "FAILED",
      message: error.message,
      stack: error.stack,
      key_present: !!process.env.GEMINI_API_KEY,
      key_length: process.env.GEMINI_API_KEY?.length
    });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "vet-chatbot-backend",
    time: new Date(),
    db: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    env: {
      mongo: !!process.env.MONGO_URI,
      gemini: !!process.env.GEMINI_API_KEY
    }
  });
});

/* ---------- Static File Serving & SPA Fallback ---------- */

// Robust detection of public path
const possiblePaths = [
  path.resolve(process.cwd(), "public"),
  path.resolve(process.cwd(), "backend/public"),
  path.resolve(__dirname, "../public")
];

let publicPath = possiblePaths[0];
for (const p of possiblePaths) {
  if (fs.existsSync(path.join(p, "index.html"))) {
    publicPath = p;
    break;
  }
}

console.log(`🏠 Calculated Public Path: ${publicPath}`);
app.use(express.static(publicPath));

app.get("*", (req, res) => {
  // If request is for an API route that wasn't caught, return 404
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }

  const indexPath = path.join(publicPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Frontend build not found. Please run build script.");
  }
});

/* ---------- Start Server ---------- */
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI || "")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err.message));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
