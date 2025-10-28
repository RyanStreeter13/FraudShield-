import React from "react";
import "./Home.css"; // CSS file for homepage
import OnlineSafetyImage from "../logos/two.png"; // import the image

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero container">
        <div className="hero-left">
          <h1>Stay Safe Online, Learn Smartly</h1>
          <p>
            Explore interactive modules on fraud, scams, AI-powered detection, and
            practical activities to strengthen your online security skills.
          </p>
          <div className="hero-buttons">
            <button className="cta learner">I'm a Learner</button>
            <button className="cta teacher">I'm a Teacher</button>
            <button className="cta parent">I'm a Parent</button>
          </div>
        </div>
        <div className="hero-right">
          <img
            src={OnlineSafetyImage}
            alt="Online safety illustration"
            className="hero-image"
          />
        </div>
      </section>

      <section className="features container">
        <h2>What You Can Learn</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Fraud & Scam Awareness</h3>
            <p>Understand phishing, scams, and AI-generated fraud tactics.</p>
          </div>
          <div className="feature-card">
            <h3>Interactive Labs</h3>
            <p>Practice with dummy phishing emails and link verification tools.</p>
          </div>
          <div className="feature-card">
            <h3>News & Updates</h3>
            <p>Stay informed on the latest online threats and scams.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
