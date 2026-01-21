import { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";

export default function ChatWidget({ sessionId, context }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 10000 }}>
        {!open && (
          <button
            onClick={() => setOpen(true)}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              fontSize: "30px",
              cursor: "pointer",
              background: "#ef4444", /* BRIGHT RED */
              color: "white",
              border: "4px solid #facc15",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)"
            }}
          >
            🚑
          </button>
        )}

        {open && (
          <ChatWindow
            sessionId={sessionId}
            context={context}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    </>
  );
}
