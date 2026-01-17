import { useState } from "react";
import ChatWindow from "./ChatWindow";

/**
 * ChatWidget
 * -----------
 * This component is responsible ONLY for:
 * - Floating button UI
 * - Open / close state
 *
 * IMPORTANT:
 * - sessionId is PROVIDED by the SDK
 * - This component MUST NOT generate sessionId
 */
export default function ChatWidget({ sessionId, context }) {
  // Controls whether the chat window is open
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            fontSize: "24px",
            cursor: "pointer",
            background: "#007bff",
            color: "white",
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999
          }}
        >
          💬
        </button>
      )}

      {open && (
        <ChatWindow
          sessionId={sessionId}
          context={context}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
