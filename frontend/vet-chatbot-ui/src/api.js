import axios from "axios";

const API_BASE = "https://vet-chatbot-backend-uon9.onrender.com";

/**
 * Sends a chat message to backend
 */
export async function sendMessage({ sessionId, message, context }) {
  const res = await axios.post(`${API_BASE}/`, {
    sessionId,
    message,
    context
  });

  return res.data;
}
