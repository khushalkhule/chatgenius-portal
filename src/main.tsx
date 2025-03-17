
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Global error handler to catch unhandled errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

// Global promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

try {
  createRoot(document.getElementById("root")!).render(<App />);
} catch (error) {
  console.error('Error rendering app:', error);
  
  // Display a basic error message if app fails to render
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>Something went wrong</h2>
        <p>The application failed to load. Please check the console for details.</p>
      </div>
    `;
  }
}
