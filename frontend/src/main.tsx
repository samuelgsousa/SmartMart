import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { SidebarProvider } from './components/ui/sidebar'
//import './styles.css'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <BrowserRouter>
      <SidebarProvider>
      <App />
    </SidebarProvider>

 
</BrowserRouter>
)
