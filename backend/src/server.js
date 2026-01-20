import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Imports from other files
import chatRoutes from "./routes/chat.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. CORS - EXPLICIT
app.use(cors({
  origin: true, // Reflects the origin of the request
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// 2. Logging - LOG EVERYTHING
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

// 3. Health Check
app.get("/", (req, res) => {
  res.json({ status: "alive", message: "Veterinary Chatbot Backend is running", time: new Date().toISOString() });
});

// 4. API Routes - Mount them explicitly
app.use("/api", chatRoutes);

// 5. Static Files (SDK) - Fix path
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));

// 6. Catch-all for API 404s (to see why they happen)
app.use("/api/*", (req, res) => {
  console.log(`🚨 API 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: "API Route Not Found", path: req.originalUrl });
});

// 7. Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error", err));

// 8. Listen
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📂 Public path: ${publicPath}`);
});
