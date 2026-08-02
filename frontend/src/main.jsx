import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { DataProvider } from './context/DataProvider.jsx'
import { ThemeProvider } from '@material-tailwind/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DataProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </DataProvider>
  </React.StrictMode>
)