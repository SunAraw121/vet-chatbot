import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";

import chatRoutes from "./routes/chat.routes.js";

const app = express();

// 1. CORS (Top level)
app.use(cors());
app.use(express.json());

// 2. Logging
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 3. Health Check
app.get("/", (req, res) => {
  res.json({ status: "alive", message: "Veterinary Chatbot Backend is running" });
});

// 4. API Routes
app.use("/api", chatRoutes);

// 5. SDK / Static Files
app.use(express.static(path.join(process.cwd(), "public")));

// 6. Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error", err));

// 7. Listen
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
