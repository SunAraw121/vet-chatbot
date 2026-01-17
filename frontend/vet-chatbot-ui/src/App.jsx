import ChatWidget from "./ChatWidget";

export default function App({ sessionId, context }) {
  return <ChatWidget sessionId={sessionId} context={context} />;
}
