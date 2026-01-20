import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";

// Import controller
import { handleChat } from "./controllers/chat.controller.js";

const app = express();

/**
 * 💥 EMERGENCY LOGGER
 * This MUST be the very first line of execution.
 */
app.use((req, res, next) => {
  console.log(`📡 [LOG] Request: ${req.method} ${req.url}`);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());

// 1. Diagnostic Root
app.get("/", (req, res) => {
  res.json({ IAmWorking: true, path: "ROOT", note: "If you see this, the server is ALIVE" });
});

// 2. Diagnostic Path
app.get("/verify-this-path", (req, res) => {
  res.json({ IAmWorking: true, path: "VERIFY", note: "If you see this, Sub-routing is WORKING" });
});

// 3. MAIN CHAT ENDPOINT
app.post("/chat", handleChat);
app.post("/api/chat", handleChat); // Support both

// 4. NUCLEAR CATCH-ALL
app.all("*", (req, res) => {
  console.log(`🚨 [CATCH-ALL] Hit by ${req.method} ${req.url}`);
  res.status(200).json({
    message: "Nuclear Catch-All Triggered",
    receivedPath: req.url,
    method: req.method
  });
});

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI || "").then(() => {
  console.log("✅ DB Connected");
}).catch(err => console.error("❌ DB Error", err.message));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 NUCLEAR SERVER READY ON PORT ${PORT}`);
});
