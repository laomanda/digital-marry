import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

const currentPath = window.location.pathname

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      {currentPath === '/' ? <App /> : <NotFoundPage />}
    </ErrorBoundary>
  </StrictMode>
)
