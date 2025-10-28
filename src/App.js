// src/App.js
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Education from "./components/Education";
import Scanners from "./components/Scanners";
import Resources from "./components/Resources";

import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify"; // ✅ import toast
import "react-toastify/dist/ReactToastify.css"; // ✅ toast CSS
import "./index.css";

function App() {
  const [page, setPage] = useState("home");
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // Track user login state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Toast helpers
  const notifySuccess = (message) =>
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });

  const notifyError = (message) =>
    toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });

  // Handlers
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      notifySuccess("Logged in successfully!");
      setShowLogin(false);
    } catch (error) {
      notifyError("Login failed: " + error.message);
    }
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      notifySuccess("Account created!");
      setShowLogin(false);
    } catch (error) {
      notifyError("Sign-up failed: " + error.message);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    notifySuccess("Logged out successfully!");
  };

  return (
    <div>
      <Navbar
        setPage={setPage}
        setShowLogin={setShowLogin}
        user={user}
        handleLogout={handleLogout}
      />

      {/*use these names for taskbar linking*/} 
      {page === "home" && <Home />}
      {page === "education" && <Education />}
      {page === "scanners" && <Scanners />}
      {page === "resources" && <Resources />}

      {showLogin && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Login</h2>
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
            <div className="modal-buttons">
              <button onClick={handleLogin}>Login</button>
              <button onClick={handleSignUp}>Sign Up</button>
              <button onClick={() => setShowLogin(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container must be included once in your app */}
      <ToastContainer />
    </div>
  );
}

export default App;