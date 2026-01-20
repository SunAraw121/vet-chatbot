import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";

// Imports from other files
import chatRoutes from "./routes/chat.routes.js";

const app = express();

// 1. CORS
app.use(cors());
app.use(express.json());

// 2. Logging
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 3. Health Check
app.get("/", (req, res) => {
  res.json({
    status: "alive",
    message: "Veterinary Chatbot Backend is running",
    env: process.env.NODE_ENV || "development"
  });
});

// 4. API Routes
app.use("/api", chatRoutes);

// 5. Static Files (SDK)
// We use process.cwd() which is reliable on Render if Root Directory is 'backend'
const publicPath = path.join(process.cwd(), "public");
app.use(express.static(publicPath));

// 6. Database
if (!process.env.MONGO_URI) {
  console.error("❌ CRITICAL: MONGO_URI is not defined in environment variables!");
} else {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err.message));
}

// 7. Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📂 Serving static files from: ${publicPath}`);
});
