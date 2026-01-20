import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Imports from other files
import chatRoutes from "./routes/chat.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

console.log("🛠️ Initializing Middleware...");

// 1. Aggressive Manual CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method === "OPTIONS") {
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
  res.status(200).json({
    status: "alive",
    message: "Veterinary Chatbot Backend is running",
    time: new Date().toISOString()
  });
});

// 4. API Routes
app.use("/api", chatRoutes);

// 5. Static Files (SDK)
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));

// 6. Database
if (!process.env.MONGO_URI) {
  console.error("❌ CRITICAL: MONGO_URI is missing!");
} else {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch(err => {
      console.error("❌ MongoDB connection error:", err.message);
    });
}

// 7. Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 CRITICAL SERVER ERROR:", err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// 8. Start
const PORT = process.env.PORT || 4000;
console.log(`⌛ Attempting to listen on port ${PORT}...`);

app.listen(PORT, () => {
  console.log(`🚀 Server fully operational on port ${PORT}`);
  console.log(`📂 Serving static files from: ${publicPath}`);
});
