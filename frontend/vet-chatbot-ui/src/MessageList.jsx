/**
 * MessageList
 * -----------
 * Pure presentational component.
 * No logic. No state.
 */
export default function MessageList({ messages }) {
  return (
    <div
      style={{
        flex: 1,
        padding: "10px",
        overflowY: "auto"
      }}
    >
      {messages.map((m, i) => (
        <div key={i} style={{ marginBottom: "8px" }}>
          <strong>{m.role === "user" ? "You" : "Bot"}:</strong>{" "}
          {m.content}
        </div>
      ))}
    </div>
  );
}
