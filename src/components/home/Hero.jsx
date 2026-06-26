import React from "react";
import "./Hero.css";

// Keeps your existing image asset path intact
import hoodie from "../../assets/images/hoodie.png";

const Hero = () => {
  return (
    <section className="hero">
      {/* Slider Controls */}
      <button className="hero-arrow left" aria-label="Previous Slide">
        &#10094;
      </button>

      <button className="hero-arrow right" aria-label="Next Slide">
        &#10095;
      </button>

      {/* Center Layout Container */}
      <div className="hero-content">
        <h1 className="hero-title">
          EXPERIENCE FASHION
        </h1>

        <h2 className="hero-subtitle">
          BEYOND IMAGES
        </h2>

        {/* Buttons Subgroup Layout */}
        <div className="hero-buttons">
          <button className="explore-btn">
            EXPLORE ALL
          </button>
          
          <button className="shop-btn">
            SHOP NOW
          </button>
        </div>

        {/* Product Display Element Box */}
        <div className="hero-image-wrapper">
          <img
            src={hoodie}
            alt="Neo-Nature Designer Hoodie"
            className="hero-image"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;