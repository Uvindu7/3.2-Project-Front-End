import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-20 pb-8">
      <div className="container">
        <div className="mb-16">
          <div className="footer-branding">
            <h3 className="font-sans font-normal text-2xl normal-case opacity-80">Experience the Future of Fashion</h3>
            <h2 className="text-[2.2rem] font-bold mt-2">With <span className="font-outfit tracking-widest">LIYARA</span> Clothing</h2>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-8 mb-8 flex-wrap gap-8">
          <div className="flex items-center gap-3 text-[0.9rem]">
            <span className="email-icon">📧</span>
            <a href="mailto:liyaracloathing@gmail.com" className="hover:underline">liyaracloathing@gmail.com</a>
          </div>
          
          <nav className="flex gap-8 flex-wrap">
            <a href="/about" className="text-[0.8rem] font-semibold opacity-70 hover:opacity-100 transition-opacity">About Us</a>
            <a href="/contact" className="text-[0.8rem] font-semibold opacity-70 hover:opacity-100 transition-opacity">Contact Us</a>
            <a href="/" className="text-[0.8rem] font-semibold opacity-70 hover:opacity-100 transition-opacity">Home</a>
            <a href="/trending" className="text-[0.8rem] font-semibold opacity-70 hover:opacity-100 transition-opacity">Trending</a>
          </nav>
        </div>

        <div className="text-center my-16">
          <h1 className="text-[clamp(5rem,20vw,15rem)] font-extrabold tracking-[0.2em] leading-[0.8] text-white m-0 font-outfit">LIYARA</h1>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-[0.7rem] opacity-60 flex-wrap gap-6">
          <div className="flex gap-6 text-[1.2rem]">
            <a href="#" className="hover:text-[#ff3e3e] transition-colors"><i className="fab fa-facebook"></i></a>
            <a href="#" className="hover:text-[#ff3e3e] transition-colors"><i className="fab fa-youtube"></i></a>
            <a href="#" className="hover:text-[#ff3e3e] transition-colors"><i className="fab fa-tiktok"></i></a>
            <a href="#" className="hover:text-[#ff3e3e] transition-colors"><i className="fab fa-instagram"></i></a>
          </div>
          
          <div className="copyright">
            2026 LIYARA Clothing. All rights reserved
          </div>
          
          <button className="text-white font-bold flex items-center gap-2 bg-transparent border-none" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            SCROLL TOP <span>↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

