import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";

import chatRoutes from "./routes/chat.routes.js";

/**
 * 1️⃣ Create the app FIRST
 * If this line is not first, `app` does not exist.
 */
const app = express();

/**
 * 2️⃣ Middleware
 */
app.use(cors({
  origin: "*", // Allow all origins for the SDK to work anywhere
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

/**
 * 3️⃣ Serve public files (SDK)
 */
app.use(express.static(path.join(process.cwd(), "public")));

/**
 * 4️⃣ API routes
 */
app.use("/api", chatRoutes);

/**
 * 4️⃣ Root route for health check
 */
app.get("/", (req, res) => {
  res.json({ status: "alive", message: "Veterinary Chatbot Backend is running" });
});

/**
 * 5️⃣ Database connection
 */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch(err => {
    console.error("❌ MongoDB connection error", err);
  });

/**
 * 6️⃣ Start server (LAST)
 */
const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
