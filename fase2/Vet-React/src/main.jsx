import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)