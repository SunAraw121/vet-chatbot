import { useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { sendMessage } from "./api";

/**
 * ChatWindow
 * ----------
 * Responsible for:
 * - Showing messages
 * - Calling backend
 * - Handling loading & errors
 */
export default function ChatWindow({ sessionId, context, onClose }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSend(text) {
    try {
      setLoading(true);
      setError(null);

      // Show user message immediately
      setMessages(prev => [...prev, { role: "user", content: text }]);

      // Call backend
      const res = await sendMessage({
        sessionId,
        message: text,
        context: context // Send context with message
      });

      // Show bot reply
      setMessages(prev => [...prev, { role: "bot", content: res.reply }]);
    } catch (err) {
      console.error("Chat Error Detailed:", err);
      if (err.response) {
        console.error("Response Data:", err.response.data);
        console.error("Response Status:", err.response.status);
      }
      setError("Something went wrong. Please check console (F12) for details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "90px",
        right: "20px",
        width: "320px",
        height: "420px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        background: "#fff"
      }}
    >
      <div
        style={{
          padding: "15px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#1e293b",
          color: "white",
          borderRadius: "8px 8px 0 0"
        }}
      >
        <strong style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🐾</span> Dr. Paw AI
        </strong>
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>

      <MessageList messages={messages} />

      {loading && <div style={{ padding: "6px" }}>Typing...</div>}
      {error && <div style={{ color: "red", padding: "6px" }}>{error}</div>}

      <MessageInput onSend={handleSend} />
    </div>
  );
}
