import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

// Mock chat page for now, or the real one if it exists inside App?
// Based on architecture, the ChatWidget uses a script tag but the dashboard is a React page.
// We can host the dashboard on the same route structure.
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={
          <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>Vet Chatbot Demo Site</h1>
            <p>The chatbot should appear in the bottom right.</p>
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default App;
