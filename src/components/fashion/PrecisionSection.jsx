import React from "react";
import "./PrecisionSection.css";

// Replace with your actual image path (the raglan t-shirt image from the mockup)
import tshirtImage from "../../assets/images/tshirt.jpg"; 

function PrecisionSection() {
  return (
    <section className="precision-section">
      {/* Left Column: Text & Parameter Grid */}
      <div className="precision-left">
        <span className="precision-tagline">TAILORED INTELLIGENCE</span>
        
        <h2 className="precision-heading">The Precision Fit.</h2>
        
        <p className="precision-description">
          No more guesswork. Input your unique body parameters and let our AI 
          determine your perfect silhouette across our entire collection.
        </p>

        {/* Measurement Grid */}
        <div className="parameter-grid">
          <div className="parameter-card">
            <span className="param-icon">⚿</span> {/* Replace with your own SVG/Icon library */}
            <span className="param-label">Chest Width</span>
          </div>
          <div className="parameter-card">
            <span className="param-icon">↕</span>
            <span className="param-label">Upper Body Length</span>
          </div>
          <div className="parameter-card">
            <span className="param-icon">📐</span>
            <span className="param-label">Shoulder Width</span>
          </div>
          <div className="parameter-card">
            <span className="param-icon">◯</span>
            <span className="param-label">Neck Size</span>
          </div>
          <div className="parameter-card full-width">
            <span className="param-icon">⚬—⚬</span>
            <span className="param-label">Sleeve Length</span>
          </div>
        </div>
      </div>

      {/* Right Column: Visual Preview */}
      <div className="precision-right">
        <div className="image-container">
          <img 
            src={tshirtImage} 
            alt="The Precision Fit Showcase" 
            className="showcase-img"
          />
          {/* Subtle sparkles icon in the bottom right corner */}
          <div className="sparkle-overlay">✦</div>
        </div>
      </div>
    </section>
  );
}

export default PrecisionSection;