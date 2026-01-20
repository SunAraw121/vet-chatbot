import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import ChatWidget from './ChatWidget';

const App = ({ sessionId, context }) => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={
          <div style={{ padding: '50px', textAlign: 'center', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🐾 Vet Chatbot Demo Site</h1>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>The chatbot is active in the bottom right corner.</p>
            <ChatWidget sessionId={sessionId} context={context} />
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default App;
