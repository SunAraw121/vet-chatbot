import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import path from "path";

// Imports from other files
import chatRoutes from "./routes/chat.routes.js";

const app = express();

/**
 * 1. MANUAL CORS MIDDLEWARE (CRITICAL FIX)
 * This sits at the very top to catch all requests (including preflights).
 */
app.use((req, res, next) => {
  // Allow any origin for the internship project
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  // Handle Preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    console.log(`📡 [${new Date().toISOString()}] Handled OPTIONS for ${req.url}`);
    return res.status(200).send();
  }

  next();
});

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
    time: new Date().toISOString()
  });
});

// 4. API Routes
app.use("/api", chatRoutes);

// 5. Static Files (SDK)
const publicPath = path.join(process.cwd(), "public");
app.use(express.static(publicPath));

// 6. Database
if (!process.env.MONGO_URI) {
  console.error("❌ CRITICAL: MONGO_URI is not defined!");
} else {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err.message));
}

/**
 * 7. GLOBAL ERROR HANDLER
 * Ensures that if something breaks, we return a JSON response with status 500,
 * rather than an HTML error page which can trigger CORS/Preflight blocks.
 */
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL SERVER ERROR:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message
  });
});

// 8. Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📂 Public path: ${publicPath}`);
});
