import axios from "axios";

// Dynamic API Base URL detection
// 1. If local -> localhost:4000
// 2. If already on Render -> use relative /api
// 3. If on Vercel -> use the absolute Render URL
const getApiBase = () => {
  if (typeof window === "undefined") return "https://vet-chatbot-backend-uon9.onrender.com/api";

  const { hostname } = window.location;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:4000/api";
  }
  if (hostname.includes("onrender.com")) {
    return "/api";
  }
  return "https://vet-chatbot-backend-uon9.onrender.com/api";
};

const API_BASE = getApiBase();

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
