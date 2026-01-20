import axios from "axios";

const API_BASE = "https://vet-chatbot-backend-uon9.onrender.com";

/**
 * Sends a chat message to backend (GHOST PROTOCOL - GET Bypass)
 */
export async function sendMessage({ sessionId, message, context }) {
  // We stringify the payload and encode it into the URL to avoid the OPTIONS preflight block.
  const payload = encodeURIComponent(JSON.stringify({ sessionId, message, context }));

  const res = await axios.get(`${API_BASE}/chat?data=${payload}`);

  return res.data;
}
