import { useState } from "react";

/**
 * MessageInput
 * ------------
 * Handles only user input.
 */
export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;

    onSend(text);
    setText("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        borderTop: "1px solid #ddd"
      }}
    >
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type a message..."
        style={{ flex: 1, padding: "8px" }}
      />
      <button type="submit">Send</button>
    </form>
  );
}
