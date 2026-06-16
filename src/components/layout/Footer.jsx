import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-branding">
            <h3>Experience the Future of Fashion</h3>
            <h2>With <span>LIYARA</span> Clothing</h2>
          </div>
        </div>

        <div className="footer-middle">
          <div className="contact-info">
            <span className="email-icon">📧</span>
            <a href="mailto:liyaracloathing@gmail.com">liyaracloathing@gmail.com</a>
          </div>
          
          <nav className="footer-nav">
            <a href="/about">About Us</a>
            <a href="/contact">Contact Us</a>
            <a href="/">Home</a>
            <a href="/trending">Trending</a>
          </nav>
        </div>

        <div className="footer-logo-massive">
          <h1>LIYARA</h1>
        </div>

        <div className="footer-bottom">
          <div className="social-links">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
            <a href="#"><i className="fab fa-tiktok"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
          
          <div className="copyright">
            2026 LIYARA Clothing. All rights reserved
          </div>
          
          <button className="scroll-top" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            SCROLL TOP <span>↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
