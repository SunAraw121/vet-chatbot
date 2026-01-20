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
 * These depend on `app`, so they must come AFTER it.
 */
app.use(cors());
app.use(express.json());

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
