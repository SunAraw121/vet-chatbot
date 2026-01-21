import axios from "axios";

// Standard production backend URL
const PROD_URL = "https://vet-chatbot-backend-uon9.onrender.com/api";

const getApiBase = () => {
  if (typeof window === "undefined") return PROD_URL;

  const { hostname } = window.location;
  // If running locally, hit the local backend
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:4000/api";
  }
  // If we are on the backend itself (Render), use relative path
  if (hostname.includes("onrender.com")) {
    return "/api";
  }
  // Default to production URL (for Vercel or other domains)
  return PROD_URL;
};

const API_BASE = getApiBase();

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
