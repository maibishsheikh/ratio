import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App';

// Always start fresh — clear any persisted phase state
try {
  const key = 'ratiocraft-progress-v2';
  const raw = localStorage.getItem(key);
  if (raw) {
    const data = JSON.parse(raw);
    if (data?.state) {
      data.state.currentPhase    = 'wonder';
      data.state.currentWorldId  = 1;
      localStorage.setItem(key, JSON.stringify(data));
    }
  }
} catch (_) {}

createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
);
