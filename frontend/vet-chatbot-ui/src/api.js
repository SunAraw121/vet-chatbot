import axios from "axios";

// Working production backend URL (NO trailing slash)
const PROD_URL = "https://vet-chatbot-backend.onrender.com/api";

export const getApiBase = () => {
  if (typeof window === "undefined") return PROD_URL;

  const { hostname } = window.location;

  // 1. Local development
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:4000/api";
  }

  // 2. Same-origin (Running on Render)
  if (hostname.includes("onrender.com")) {
    return "/api";
  }

  // 3. Every other case (Vercel, etc)
  return PROD_URL;
};

export const API_BASE = getApiBase();
console.log(`🔌 [API] Target: ${API_BASE}`);

/**
 * Sends a chat message to backend
 */
export async function sendMessage({ sessionId, message, context }) {
  console.log("🚀 [API] Request to:", `${API_BASE}/chat`);

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
    console.error("❌ [API] Error:", error.response?.data || error.message);
    throw error;
  }
}
