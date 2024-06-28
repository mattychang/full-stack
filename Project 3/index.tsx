// Matthew Chang
// CSDS 221: initialize

// importing modules
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// creating the root
const root = createRoot(document.getElementById('app'));

// rendering the app component
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
