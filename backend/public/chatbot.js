(function () {
  // 1. Identify or generate sessionId
  const config = window.VetChatbotConfig || {};
  let sessionId = config.userId || localStorage.getItem('vet_chatbot_session_id');

  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('vet_chatbot_session_id', sessionId);
  }

  // 2. Pass data to the React app via a global variable
  window.__VET_CHATBOT_DATA__ = {
    sessionId: sessionId,
    context: config
  };

  // 3. Create root element for React
  const root = document.createElement('div');
  root.id = 'root'; // Vite's default root id
  document.body.appendChild(root);

  // 4. Load the React bundle
  // In a real production environment, this would point to a CDN or your hosted JS file.
  // For local development, we point it to the backend's static file server.
  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'https://vet-chatbot-backend-uon9.onrender.com/assets/index.js'; // This will be the built bundle

  // Also load the styles
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://vet-chatbot-backend-uon9.onrender.com/assets/index.css';

  document.head.appendChild(link);
  document.head.appendChild(script);

  console.log('✅ Vet Chatbot SDK Loaded');
})();
