import React from "react";
import "./TechnologySection.css";

// Replace these placeholders with your actual image paths from your assets folder
import closetImg from "../../assets/images/closet.jpg";
import fabricImg from "../../assets/images/fabric-detail.jpg";

function TechnologySection() {
  return (
    <section className="chromatic-section">
      
      {/* LEFT SIDE: Visual Grid Dashboard */}
      <div className="chromatic-left-grid">
        
        {/* Top Left: Wardrobe/Closet View */}
        <div className="grid-item wardrobe-box">
          <img src={closetImg} alt="Wardrobe Selection" />
        </div>

        {/* Top Right: Color Theory Ratio Indicator */}
        <div className="grid-item ratio-box">
          <span className="ratio-title">COLOR THEORY RATIO</span>
          <div className="ratio-bar-container">
            <div className="ratio-bar-fill"></div>
          </div>
          <p className="ratio-text">
            Optimal contrast detected<br />for Obsidian Black T-shirt.
          </p>
        </div>

        {/* Bottom Left: AI Pairing Active Banner */}
        <div className="grid-item ai-active-box">
          <div className="ai-content">
            <span className="sparkle-icon">✦✦</span>
            <span className="ai-text">AI PAIRING ACTIVE</span>
          </div>
        </div>

        {/* Bottom Right: Fabric / Trouser Detail View */}
        <div className="grid-item fabric-box">
          <img src={fabricImg} alt="Trouser Fabric Close-up" />
        </div>

      </div>

      {/* RIGHT SIDE: Text & Feature Details */}
      <div className="chromatic-right-info">
        <span className="chromatic-tagline">The LIYARA Intelligence</span>
        
        <h2 className="chromatic-heading">Chromatic Harmony.</h2>
        
        <p className="chromatic-description">
          Fashion is a language of color and proportion. Our proprietary AI doesn't 
          just recommend clothes—it understands color theory.
        </p>

        {/* Features List */}
        <div className="features-list">
          
          <div className="feature-item">
            <div className="feature-icon">🎨</div> {/* Replace with an SVG icon if needed */}
            <div className="feature-text">
              <h3>Dynamic Complementary Selection</h3>
              <p>
                The system analyzes the hex-code of your selected T-shirt and 
                cross-references it with our trousers collection to find the perfect 
                chromatic balance.
              </p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">⌨</div> {/* Replace with an SVG icon if needed */}
            <div className="feature-text">
              <h3>Proportional Fit Engine</h3>
              <p>
                Matching the silhouette drape of your T-shirt with the ideal trouser 
                cut to maintain a balanced, high-end profile.
              </p>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}

export default TechnologySection;