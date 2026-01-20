import axios from "axios";

// Standard backend URL
const API_BASE = "https://vet-chatbot-backend-uon9.onrender.com/api";

/**
 * Sends a chat message to backend (Standard POST)
 */
export async function sendMessage({ sessionId, message, context }) {
  console.log("🚀 [API] Sending POST request to:", `${API_BASE}/chat`);

  try {
    const res = await axios.post(`${API_BASE}/chat`, {
      sessionId,
      message,
      context
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return res.data;
  } catch (error) {
    console.error("❌ [API] POST Failed:", error);
    throw error;
  }
}
