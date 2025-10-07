import React from "react";
import Carousel from "./Carousel"; // import your carousel

export default function Home() {
  return (
    <div>
      <section className="hero container">
        <div className="hero-left">
          <h1>Boost your learning!</h1>
          <p>
            Learn with millions of people worldwide by exploring videos, tackling
            practice problems, and getting AI-powered support.
          </p>
        </div>
        <div className="hero-right">
          <button className="cta">I'm a learner</button>
          <button className="cta">I'm a teacher</button>
          <button className="cta">I'm a parent</button>
        </div>
      </section>

      {/* Add the carousel below the hero section */}
      <Carousel />
    </div>
  );
}
