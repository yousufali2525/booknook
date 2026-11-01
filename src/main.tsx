import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// @ts-ignore
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}