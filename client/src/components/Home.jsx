// src/components/Home.jsx
import React from "react";
import "./Home.css";
import OnlineSafetyImage from "../logos/two.png";

export default function Home({ user, setShowLogin, setPage }) {
  const handleGetStarted = () => {
    if (!user) {
      setShowLogin(true);
    } else {
      setPage("education"); // ✅ uses your existing page state
    }
  };

  return (
    <div className="home-page">
      {/* ===== Hero Section ===== */}
      <section className="hero container">
        <div className="hero-left">
          <h1 className="hero-title">Learn to Spot Scams and Stay Safe Online</h1>
          <p className="hero-text">
            FraudShield helps you recognize scams, avoid phishing, and build
            real-world fraud detection skills through short, interactive lessons
            and quizzes.
          </p>

          <button className="cta-button" onClick={handleGetStarted}>
            {user ? "Go to Dashboard" : "Get Started"}
          </button>

          <p className="user-status">
            {user ? (
              <>
                Logged in as <strong>{user.email}</strong>
              </>
            ) : (
              <>You’re browsing as a guest. Log in for full access.</>
            )}
          </p>
        </div>

        <div className="hero-right">
          <img
            src={OnlineSafetyImage}
            alt="Online safety illustration"
            className="hero-image"
          />
        </div>
      </section>

      {/* ===== Highlights Section ===== */}
      <section className="features container">
        <h2>Explore Key Topics</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Phishing Awareness</h3>
            <p>
              Learn to detect fake links, emails, and websites designed to steal
              your information.
            </p>
          </div>
          <div className="feature-card">
            <h3>Social Engineering</h3>
            <p>
              Understand manipulation tactics used by scammers to gain your
              trust and access.
            </p>
          </div>
          <div className="feature-card">
            <h3>Secure Practices</h3>
            <p>
              Discover password hygiene, two-factor authentication, and
              safe-browsing habits.
            </p>
          </div>
          <div className="feature-card">
            <h3>AI & Deepfake Scams</h3>
            <p>
              Explore how artificial intelligence is used in modern scams—and
              how to recognize them.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Call-to-Action Footer ===== */}
      <section className="cta-section">
        <h2>Ready to Start Learning?</h2>
        <p>
          Begin your journey with short, interactive lessons that build your
          confidence online.
        </p>
        <button className="cta-button large" onClick={handleGetStarted}>
          {user ? "Go to Dashboard" : "Sign Up for Free"}
        </button>
      </section>
    </div>
  );
}
