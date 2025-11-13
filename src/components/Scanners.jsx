// src/components/Scanners.jsx
import React from "react";

const Scanners = ({ setPage }) => {
  return (
    <div className="container">
      <h1>Scanners Page</h1>
      <p>Explore the scanning tools here.</p>
      <button onClick={() => setPage("home")}>Back to Home</button>
    </div>
  );
};

export default Scanners;
