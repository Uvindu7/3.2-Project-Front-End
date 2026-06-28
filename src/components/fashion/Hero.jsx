import React from "react";
import "./Hero.css";

import hoodie from "../../assets/images/hoodie.png";

const Hero = () => {
  return (
    <section className="about-hero">

      <div className="hero-left">

        <p className="hero-label">
          NEW COLLECTION
        </p>

        <h1>
          Redefining the Physics of
          <br />
          Fashion.
        </h1>

        <p className="hero-text">
          LIYARA offers unprecedented virtual realism through advanced
          garment simulation and interactive visualization.
          Experience every fold, texture and movement before making
          your purchase.
        </p>

        <button>
          VIEW COLLECTION
        </button>

      </div>

      <div className="hero-right">

        <div className="hero-image-box">

          <img
            src={hoodie}
            alt="hoodie"
          />

        </div>

      </div>

    </section>
  );
};

export default Hero;