import express from "express";
import { handleChat, getConversationHistory, getAppointments } from "../controllers/chat.controller.js";

const router = express.Router();
console.log("🛣️ Chat routes initialized...");

// POST /api/chat - Send a message and get a response
router.post("/chat", handleChat);

// GET /api/conversations/:sessionId - Get conversation history
router.get("/conversations/:sessionId", getConversationHistory);

// GET /api/appointments - Get all appointments (Admin)
router.get("/appointments", getAppointments);

export default router;
