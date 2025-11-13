// src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Get root container
const container = document.getElementById("root");

// Create root (React 19)
const root = createRoot(container);

// Render App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
