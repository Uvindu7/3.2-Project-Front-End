import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container container">
        <div className="hero-content">
          <h1 className="hero-title">
            EXPERIENCE FASHION <br />
            <span className="light">BEYOND IMAGES</span>
          </h1>
          
          <div className="hero-actions">
            <button className="btn outline">EXPLORE ALL</button>
            <button className="btn dark">SHOP NOW</button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hoodie-viewer">
            <div className="nav-arrow left">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </div>
            
            <div className="hoodie-card">
              <div className="hoodie-image-container">
                <img src="/images/hero-hoodie.png" alt="Neo Nature Hoodie" className="hoodie-img" />
              </div>
            </div>

            <div className="nav-arrow right">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
