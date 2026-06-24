import React from 'react';

const Navbar = ({ onHomeClick, onLoginClick, onContactClick }) => {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[1200px] bg-white/70 backdrop-blur-xl border border-white/30 rounded-[50px] z-[1000] shadow-md">
      <div className="flex justify-between items-center h-[60px] px-6">
        <div className="hidden lg:flex gap-6">
          <a 
            href="/" 
            className="text-[12px] font-semibold text-text-muted tracking-wider hover:text-text-main transition-colors" 
            onClick={(e) => { e.preventDefault(); onHomeClick(); }}
          >
            HOME
          </a>
          <a href="/trending" className="text-[12px] font-semibold text-text-muted tracking-wider hover:text-text-main transition-colors">TRENDING</a>
          <a 
            href="/contact" 
            className="text-[12px] font-semibold text-text-muted tracking-wider hover:text-text-main transition-colors"
            onClick={(e) => { e.preventDefault(); onContactClick(); }}
          >
            CONTACT
          </a>
          <a href="/about" className="text-[12px] font-semibold text-text-muted tracking-wider hover:text-text-main transition-colors">ABOUT US</a>
        </div>

        <div className="nav-logo cursor-pointer" onClick={onHomeClick}>
          <span className="font-outfit font-extrabold text-xl tracking-[0.1em]">LOGO</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center bg-black/5 rounded-[20px] px-3 py-1.5 focus-within:bg-black/10 transition-all">
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none text-xs w-[120px]"
            />
            <button className="flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
          <button 
            onClick={onLoginClick}
            className="bg-[#333] text-white px-5 py-2 rounded-[20px] text-[12px] font-semibold hover:bg-black transition-colors"
          >
            SIGN IN
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

