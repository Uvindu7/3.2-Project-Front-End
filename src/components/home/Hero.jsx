import React from "react";
import "./Hero.css";

import hoodie from "../../assets/images/hoodie.png";

const Hero = () => {
  return (
    <section className="hero">

      <button className="hero-arrow left">
        &#10094;
      </button>

      <button className="hero-arrow right">
        &#10095;
      </button>

      <div className="hero-content">

        <h1 className="hero-title">
          EXPERIENCE FASHION
        </h1>

        <h2 className="hero-subtitle">
          BEYOND IMAGES
        </h2>

        <div className="hero-buttons">

          <button className="explore-btn">
            EXPLORE ALL
          </button>

          <button className="shop-btn">
            SHOP NOW
          </button>

        </div>

        <div className="hero-image-wrapper">
          <img
            src={hoodie}
            alt="hoodie"
            className="hero-image"
          />
        </div>

      </div>

    </section>
  );
};

export default Hero;