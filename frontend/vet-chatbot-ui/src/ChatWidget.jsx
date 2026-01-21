import { useState } from "react";
import ChatWindow from "./ChatWindow";

/**
 * ChatWidget
 * -----------
 * This component is responsible ONLY for:
 * - Floating button UI
 * - Open / close state
 */
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
              background: "#ecc94b", /* Gold */
              color: "white",
              border: "none",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            🐾
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
