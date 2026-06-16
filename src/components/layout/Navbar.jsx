import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <div className="nav-links left">
          <a href="/" className="active">HOME</a>
          <a href="/trending">TRENDING</a>
          <a href="/contact">CONTACT</a>
          <a href="/about">ABOUT US</a>
        </div>

        <div className="nav-logo">
          <span className="logo-text">LOGO</span>
        </div>

        <div className="nav-actions right">
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
            <button className="search-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
          <button className="sign-in-btn">SIGN IN</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
