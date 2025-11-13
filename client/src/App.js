// ============================================================
//  FraudShield Frontend – Main Application Entry
// Handles routing between pages, authentication, and user state
// ============================================================

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Education from "./components/Education";
import Scanners from "./components/Scanners";
import Resources from "./components/Resources";

//  Backend API functions for authentication
import { signup, login } from "./api";

//  Toast notifications for user feedback
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//  Global styles
import "./index.css";

function App() {
  /* ============================================================
     🔹 APPLICATION STATE
     ============================================================ */

  //  Tracks which page the user is currently viewing.
  //    When refreshed, it restores from localStorage
  //    so the user stays on the same page instead of returning to Home.
  const [page, setPage] = useState(() => {
    return localStorage.getItem("fraudshield_current_page") || "home";
  });

  // When "page" changes, store it in localStorage to persist across reloads
  useEffect(() => {
    localStorage.setItem("fraudshield_current_page", page);
  }, [page]);

  // 💬 Controls whether the login/signup modal is open
  const [showLogin, setShowLogin] = useState(false);

  // 📨 Tracks login form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 👤 Stores logged-in user info, restoring it from localStorage if available
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("fraudshield_user");
    return saved ? JSON.parse(saved) : null;
  });

  /* ============================================================
     🔹 TOAST MESSAGE HELPERS (for user feedback)
     ============================================================ */
  const notifySuccess = (message) =>
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });

  const notifyError = (message) =>
    toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      theme: "colored",
    });

  /* ============================================================
     🔹 AUTHENTICATION HANDLERS (Login / Signup / Logout)
     ============================================================ */

  //  Login existing user via backend
  const handleLogin = async () => {
    if (!email || !password)
      return notifyError("Please enter both email and password.");

    try {
      const data = await login({ email, password });

      //  Expecting response: { message, token, student_id }
      if (data.message === "Login successful") {
        const loggedInUser = {
          email,
          token: data.token,
          student_id: data.student_id,
        };

        // Save in both React state & browser localStorage
        setUser(loggedInUser);
        localStorage.setItem("fraudshield_user", JSON.stringify(loggedInUser));

        notifySuccess("Logged in successfully!");
        setShowLogin(false);
        setPassword("");
      } else {
        notifyError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      notifyError("Server error during login.");
    }
  };

  //  Sign up a new user via backend
  const handleSignUp = async () => {
    if (!email || !password)
      return notifyError("Please enter both email and password.");

    // Restrict to common email providers for demo
    const allowedDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "icloud.com",
    ];
    const emailDomain = email.split("@")[1];
    if (!allowedDomains.includes(emailDomain))
      return notifyError(
        "Please use a valid email provider (e.g., Gmail, Yahoo, Outlook)."
      );

    try {
      const data = await signup({ name: email, email, password });

      if (data.message === "Signup successful") {
        const newUser = {
          email,
          token: data.token,
          student_id: data.student_id,
        };

        // Store in state and persist
        setUser(newUser);
        localStorage.setItem("fraudshield_user", JSON.stringify(newUser));

        notifySuccess("Account created successfully!");
        setShowLogin(false);
        setPassword("");
      } else {
        notifyError(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      notifyError("Server error during signup.");
    }
  };

  //  Logout the user and clear all persisted data
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("fraudshield_user");
    localStorage.removeItem("fraudshield_current_page");
    notifySuccess("Logged out successfully!");
    setPage("home"); // Return to home after logout
  };

  /* ============================================================
     🔹 FRONTEND ROUTING & PAGE DISPLAY
     ============================================================ */

  //  Displays different components depending on the current "page" value
  //    Controlled manually (no React Router required)
  return (
    <div>
      {/* Top navigation bar with login/logout and page links */}
      <Navbar
        setPage={setPage}
        setShowLogin={setShowLogin}
        user={user}
        handleLogout={handleLogout}
      />

      {/* === Conditional page rendering === */}
      {page === "home" && (
        <Home user={user} setShowLogin={setShowLogin} setPage={setPage} />
      )}

      {page === "education" &&
        (user ? (
          <Education />
        ) : (
          <p style={{ padding: "1rem" }}>Please log in to view this page.</p>
        ))}

      {page === "scanners" &&
        (user ? (
          <Scanners />
        ) : (
          <p style={{ padding: "1rem" }}>Please log in to view this page.</p>
        ))}

      {page === "resources" &&
        (user ? (
          <Resources />
        ) : (
          <p style={{ padding: "1rem" }}>Please log in to view this page.</p>
        ))}

      {/* === Login / Signup Modal === */}
      {showLogin && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{user ? "Account" : "Login"}</h2>

            {/* Form only visible if not logged in */}
            {!user && (
              <>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </>
            )}

            {/* Action Buttons */}
            <div className="modal-buttons">
              {!user && (
                <>
                  <button onClick={handleLogin}>Login</button>
                  <button onClick={handleSignUp}>Sign Up</button>
                </>
              )}
              <button onClick={() => setShowLogin(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* === Toast Container (for notifications) === */}
      <ToastContainer />
    </div>
  );
}

export default App;
