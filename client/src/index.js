// src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Get root container
const container = document.getElementById("root");

// Create React 18 root
const root = createRoot(container);

// Render the main App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
