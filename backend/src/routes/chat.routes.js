import express from "express";
import { handleChat, getConversationHistory } from "../controllers/chat.controller.js";

const router = express.Router();

// POST /api/chat - Send a message and get a response
router.post("/chat", handleChat);

// GET /api/conversations/:sessionId - Get conversation history
router.get("/conversations/:sessionId", getConversationHistory);

export default router;
