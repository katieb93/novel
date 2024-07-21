// index.js

import React from 'react';
// import ReactDOM from 'react-dom';
import ReactDOM from 'react-dom/client'; // Correct import for createRoot

import './index.css';
import App from './App'; // Rename or import directly from App.js
import reportWebVitals from './reportWebVitals';
// import AuthComponent from './authComponent'; // Import the AuthComponent

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    { <App /> }
    {/* <AuthComponent /> */}
  </React.StrictMode>
);

reportWebVitals();
