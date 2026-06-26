import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Top Branding Phrase */}
        <div className="footer-top">
          <div className="footer-branding">
            <h2>
              Experience the Future of Fashion <br />
              With <span className="brand-highlight">LIYARA</span> Clothing
            </h2>
          </div>
        </div>

        {/* Middle Meta Splitter bar */}
        <div className="footer-middle">
          <div className="contact-info">
            {/* Custom inline vector SVG mail icon matching the image */}
            <svg className="mail-icon-svg" width="18" height="14" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="24" height="18" rx="2" />
              <path d="M0 2L12 11L24 2" />
            </svg>
            <a href="mailto:liyaracloathing@gmail.com">liyaracloathing@gmail.com</a>
          </div>
          
          <nav className="footer-nav">
            <a href="/about">About Us</a>
            <a href="/contact">Contact Us</a>
            <a href="/">Home</a>
            <a href="/trending">Trending</a>
          </nav>
        </div>

        {/* Massive Brand Typographic Core Display */}
        <div className="footer-logo-massive">
          <h1>LIYARA</h1>
        </div>

        {/* Bottom Socials & Metadata Bar */}
        <div className="footer-bottom">
          <div className="social-links">
            <a href="#" aria-label="Facebook">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/></svg>
            </a>
            <a href="#" aria-label="YouTube">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="#" aria-label="TikTok">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.15c1.31 0 2.6.4 3.7 1.18v4.25c-.77-.4-1.64-.63-2.55-.65V8.5c2.3 0 4.3 1.56 4.9 3.77.7 2.51-.7 5.14-3.21 5.85-2.51.7-5.14-.7-5.85-3.21a4.86 4.86 0 0 1 3.26-5.96V.15h-.25z"/></svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            </a>
          </div>
          
          <div className="copyright">
            2026 LIYARA Clothing. All right reserved
          </div>
          
          <button className="scroll-top-btn" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            SCROLL TOP <span className="arrow-icon">⪽</span>
          </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;