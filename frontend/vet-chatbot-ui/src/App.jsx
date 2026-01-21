import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatWidget from "./ChatWidget";
import AdminDashboard from "./AdminDashboard";

function App() {
  // These will be passed from the SDK in production
  const sessionId = window.__VET_CHATBOT_DATA__?.sessionId || "demo-session-" + Date.now();
  const context = window.__VET_CHATBOT_DATA__?.context || { source: "direct" };

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={
            <div style={{ padding: '0', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
              <nav style={{ padding: '20px', background: '#1e293b', color: '#facc15', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ fontWeight: '800', fontSize: '1.5rem' }}>🐾 Dr. Paw AI</span>
              </nav>

              <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
                <div style={{ background: 'white', padding: '60px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', maxWidth: '800px' }}>
                  <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: '900', color: '#0f172a' }}>Modern Veterinary Assistant</h1>
                  <p style={{ fontSize: '1.25rem', color: '#475569', marginBottom: '2rem', lineHeight: '1.6' }}>
                    Experience the future of pet care. Ask health questions, get advice, or book an appointment in seconds.
                    The AI widget is active in the bottom right.
                  </p>
                  <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'left', padding: '15px', borderLeft: '4px solid #facc15', background: '#fefce8' }}>
                      <strong>Test AI:</strong> "My dog is coughing"
                    </div>
                    <div style={{ textAlign: 'left', padding: '15px', borderLeft: '4px solid #facc15', background: '#fefce8' }}>
                      <strong>Test Booking:</strong> "I want to schedule a visit"
                    </div>
                  </div>
                </div>
              </main>

              <ChatWidget sessionId={sessionId} context={context} />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
