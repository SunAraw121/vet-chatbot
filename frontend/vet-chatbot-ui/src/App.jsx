import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import ChatWidget from './ChatWidget';

const App = ({ sessionId, context }) => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={
          <div style={{ padding: '50px', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f8fafc' }}>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: '800' }}>🐾 Vet Assistant Demo</h1>
            <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '600px', marginBottom: '2rem' }}>
              Welcome to the Vet Chatbot SDK Demo. You can find the AI assistant in the bottom right corner.
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => window.location.href = '/admin'}
                style={{ background: '#1e293b', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
              >
                Go to Admin Dashboard
              </button>
            </div>
            <ChatWidget sessionId={sessionId} context={context} />
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default App;
