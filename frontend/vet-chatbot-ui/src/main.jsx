import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const sdkData = window.__VET_CHATBOT_DATA__ || {};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App
      sessionId={sdkData.sessionId}
      context={sdkData.context}
    />
  </StrictMode>,
)
