import axios from "axios";

const API_BASE = "http://localhost:4000/api";

/**
 * Sends a chat message to backend
 */
export async function sendMessage({ sessionId, message, context }) {
  const res = await axios.post(`${API_BASE}/chat`, {
    sessionId,
    message,
    context
  });

  return res.data;
}
