import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const sdkData = window.__VET_CHATBOT_DATA__ || {
  sessionId: 'sess_' + Math.random().toString(36).substr(2, 9),
  context: {}
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App
      sessionId={sdkData.sessionId}
      context={sdkData.context}
    />
  </StrictMode>,
)
