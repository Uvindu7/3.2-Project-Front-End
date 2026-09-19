import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-12 md:pt-20 pb-10 px-4 md:px-8 font-manrope">
      <div className="container mx-auto max-w-[1400px]">
        <div className="flex flex-col">
          {/* Top Branding */}
          <div className="mb-10 md:mb-20 text-center md:text-left">
            <h3 className="font-sans text-xl md:text-[1.6rem] font-normal text-[#d4d4d4] mb-2 md:mb-1">Experience the Future of Fashion</h3>
            <h2 className="text-3xl md:text-[2.5rem] font-bold text-white tracking-wide leading-tight">With Liyara Clothing</h2>
          </div>

          {/* Email and Navigation */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end border-b border-[#333] pb-8 md:pb-6 gap-8 md:gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 text-sm md:text-[1rem] font-medium text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mb-1 sm:mb-0">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <a href="mailto:liyaracloathing@gmail.com" className="hover:text-gray-300 transition-colors">liyaracloathing@gmail.com</a>
            </div>

            <nav className="flex gap-4 md:gap-10 flex-wrap justify-center">
              <Link to="/about" className="text-sm md:text-[0.9rem] font-bold text-white hover:text-gray-300 transition-colors">About Us</Link>
              <Link to="/contact" className="text-sm md:text-[0.9rem] font-bold text-white hover:text-gray-300 transition-colors">Contact Us</Link>
              <Link to="/" className="text-sm md:text-[0.9rem] font-bold text-white hover:text-gray-300 transition-colors">Home</Link>
              <Link to="/shop" className="text-sm md:text-[0.9rem] font-bold text-white hover:text-gray-300 transition-colors">Shop</Link>
            </nav>
          </div>

          {/* Huge Logo Image */}
          <div className="w-full flex justify-center py-6 md:py-0">
            <img src="/images/custom-liyara-logo.png" alt="LIYARA" className="w-full max-w-[1400px] object-contain select-none opacity-80 md:opacity-100" />
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center text-xs md:text-[0.75rem] text-[#777] pt-8 gap-y-6 md:gap-y-0">
            {/* Social Icons */}
            <div className="flex gap-6 md:gap-8 justify-center md:justify-start text-[1rem] text-[#999] order-2 md:order-1">
              <a href="#" className="hover:text-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon fill="black" points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.8-5.46-.4-2.52.49-5.18 2.4-6.87 1.34-1.18 3.11-1.78 4.88-1.57v4.02c-1.12-.13-2.24.16-3.13.79-.81.56-1.38 1.42-1.5 2.39-.14 1.15.35 2.34 1.19 3.14.88.82 2.14 1.12 3.33.86 1.15-.25 2.14-1.05 2.58-2.12.21-.51.3-1.07.3-1.62l.01-16.54h3.28z"></path></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center order-3 md:order-2 mt-2 md:mt-0">
              2026 LIYARA Clothing. All rights reserved.
            </div>

            {/* Scroll Top Button */}
            <div className="flex justify-center md:justify-end order-1 md:order-3">
              <button className="text-white font-bold flex items-center gap-2 bg-transparent border-none text-[0.75rem] tracking-wider hover:text-gray-300 transition-colors uppercase" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                SCROLL TOP
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="17 11 12 6 7 11"></polyline>
                  <polyline points="17 18 12 13 7 18"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;


