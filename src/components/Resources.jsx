import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Resources.css"; // Make sure this points to your CSS file
import oneImg from "../logos/one.jpg";
import twoImg from "../logos/two.png";
import threeImg from "../logos/three.jpg";

export default function Resources() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    fade: true,
  };

  const slides = [
    { id: 1, src: oneImg, alt: "Resource Slide 1", title: "Explore Guides" },
    { id: 2, src: twoImg, alt: "Resource Slide 2", title: "Discover Tools" },
    { id: 3, src: threeImg, alt: "Resource Slide 3", title: "Read Articles" },
  ];

  const resources = [
    { id: 1, title: "Guide to Photography", type: "Guide", img: oneImg },
    { id: 2, title: "Toolset for Creators", type: "Tool", img: twoImg },
    { id: 3, title: "Latest Research Articles", type: "Article", img: threeImg },
    { id: 4, title: "Support & FAQs", type: "Support", img: oneImg },
  ];

  return (
    <div className="resources-page">
      {/* Top Navigation */}
      <nav className="top-nav">
        <h1 className="logo">Resource Hub</h1>
        <ul className="nav-links">
          <li>Guides</li>
          <li>Tools</li>
          <li>Articles</li>
          <li>Support</li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="resources-main">

       


        {/* Resource Cards */}
        <section className="resource-cards">
          {resources.map((res) => (
            <div key={res.id} className="card">
              <img src={res.img} alt={res.title} />
              <div className="card-info">
                <span className="card-type">{res.type}</span>
                <h3>{res.title}</h3>
              </div>
            </div>
          ))}
        </section>

      </main>
    </div>

    
  );
}
