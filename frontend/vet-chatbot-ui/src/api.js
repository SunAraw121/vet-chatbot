import axios from "axios";

// Using the standard backend URL path
const API_BASE = "https://vet-chatbot-backend-uon9.onrender.com/api";

/**
 * Sends a chat message to backend (Standard POST)
 */
export async function sendMessage({ sessionId, message, context }) {
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
}
