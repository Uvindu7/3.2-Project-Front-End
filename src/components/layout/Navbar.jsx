import React, { useState } from "react";
import "./Navbar.css";

const Navbar = ({ onHomeClick = () => {}, onFashionClick = () => {} }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-container">
        
        {/* The Inline SVG Dynamic Shape Layer */}
        <div className="navbar-shape-bg">
          <svg viewBox="0 0 1400 90" preserveAspectRatio="none" width="100%" height="100%">
            <defs>
              <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#cbd7dc" />
                <stop offset="100%" stopColor="#bdcbd1" />
              </linearGradient>
            </defs>
            {/* Seamless custom vector path with clean, squared outer edge layouts */}
            <path 
              d="M 0 0 
                 L 460 0 
                 L 500 50 
                 L 900 50 
                 L 940 0 
                 L 1400 0 
                 L 1400 90 
                 L 0 90 
                 Z" 
              fill="url(#navGradient)" 
            />
          </svg>
        </div>

        {/* Interactive Layer */}
        <div className="navbar-content">
          
          {/* Left Side Links */}
          <div className={`nav-left ${menuOpen ? "active" : ""}`}>
            <a href="/" onClick={(e) => { e.preventDefault(); onHomeClick(); }}>HOME</a>
            <a href="/" onClick={(e) => e.preventDefault()}>TRENDING</a>
            <a href="/" onClick={(e) => e.preventDefault()}>CONTACT</a>
            <a href="/" onClick={(e) => { e.preventDefault(); onFashionClick(); }}>ABOUT US</a>
          </div>

          {/* Centered Logo Field */}
          <div className="nav-center">
            <span className="logo-text">LOGO</span>
          </div>

          {/* Right Side Tools */}
          <div className="nav-right">
            <div className="search-bar-wrapper">
              <input type="text" className="nav-search-input" placeholder="" />
            </div>

            <button className="search-icon-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            <button className="signin-btn">SIGN IN</button>
          </div>

          {/* Mobile Hamburg Toggle Button */}
          <button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;