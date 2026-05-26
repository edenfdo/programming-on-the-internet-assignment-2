// Importing React and ReactDOM 
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Importing css styling file
import './styles/index.css'

// Imports App.jsx
import App from './App.jsx'

// Creates React root
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
