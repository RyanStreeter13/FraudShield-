// src/components/Carousel.jsx
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import "../index.css";

// Import your local images
import one from "../logos/one.jpg";
import two from "../logos/two.png";
import three from "../logos/three.jpg";

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        <div>
          <img src={one} alt="Slide 1" />
        </div>
        <div>
          <img src={two} alt="Slide 2" />
        </div>
        <div>
          <img src={three} alt="Slide 3" />
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;
