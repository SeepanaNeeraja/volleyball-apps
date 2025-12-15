// src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; // if you have global css

const container = document.getElementById("root");
if (!container) {
  throw new Error("Could not find root element. Check public/index.html for <div id='root'></div>");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);