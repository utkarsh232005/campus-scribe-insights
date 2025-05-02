import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/scrollbar.css' // Import custom scrollbar styles

createRoot(document.getElementById("root")!).render(<App />);
