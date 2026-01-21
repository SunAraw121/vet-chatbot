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
  root.id = 'root';
  document.body.appendChild(root);

  // 4. Load the React bundle (Production URL) with Cache Buster
  const BASE_URL = 'https://vet-chatbot-backend-uon9.onrender.com';
  const VERSION = Date.now(); // Ensure we always load the latest build

  const script = document.createElement('script');
  script.type = 'module';
  script.src = `${BASE_URL}/assets/index.js?v=${VERSION}`;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${BASE_URL}/assets/index.css?v=${VERSION}`;

  document.head.appendChild(link);
  document.head.appendChild(script);

  console.log('✅ Dr. Paw AI SDK Loaded (v' + VERSION + ')');
})();
