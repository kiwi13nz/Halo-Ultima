// src/main.tsx - Updated with i18n
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './hr-styles.css';
import './styles/reportTemplate.css';

// Import i18n configuration
import './i18n';

// Add Poppins font from Google Fonts
const poppinsLink = document.createElement('link');
poppinsLink.rel = 'stylesheet';
poppinsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap';
document.head.appendChild(poppinsLink);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);