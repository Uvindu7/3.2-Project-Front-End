import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="pt-[10rem] pb-20 bg-[radial-gradient(circle_at_top_right,#f0f7ff_0%,#ffffff_50%)] min-h-[90vh] flex items-center">
      <div className="container flex flex-col items-center text-center gap-12">
        <div className="hero-content">
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.1] font-extrabold text-[#111] font-outfit">
            EXPERIENCE FASHION <br />
            <span className="font-light text-[#666] font-sans normal-case block mt-2">BEYOND IMAGES</span>
          </h1>

          <div className="flex flex-col md:flex-row gap-6 mt-12 justify-center w-full md:w-auto items-center">
            <Link to="/fashion" className="px-10 py-4 rounded-[40px] font-bold text-[0.9rem] tracking-[0.08em] transition-all duration-300 ease-custom min-w-[180px] flex items-center justify-center border border-[#ddd] bg-white text-[#333] hover:-translate-y-0.5 hover:shadow-lg w-full md:w-auto no-underline">EXPLORE ALL</Link>
            <Link to="/product" className="px-10 py-4 rounded-[40px] font-bold text-[0.9rem] tracking-[0.08em] transition-all duration-300 ease-custom min-w-[180px] flex items-center justify-center bg-[#333] text-white hover:-translate-y-0.5 hover:shadow-lg w-full md:w-auto no-underline">SHOP NOW</Link>
          </div>
        </div>

        <div className="w-full max-w-[1000px] relative">
          <div className="flex items-center justify-center gap-2 md:gap-8">
            <div className="hidden md:flex w-10 h-10 rounded-full border border-[#eee] items-center justify-center text-[#999] cursor-pointer bg-white transition-all duration-300 ease-custom hover:bg-[#f5f5f5] hover:text-[#333] hover:border-[#ccc]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </div>

            <div className="bg-white rounded-xl p-4 w-full max-w-[600px] aspect-[16/10] flex items-center justify-center shadow-[0_30px_60px_rgba(0,0,0,0.05)] overflow-hidden group">
              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                <img src="/images/hero-hoodie.png" alt="Neo Nature Hoodie" className="max-h-full object-contain transition-all duration-300 ease-custom group-hover:scale-105" />
              </div>
            </div>

            <div className="hidden md:flex w-10 h-10 rounded-full border border-[#eee] items-center justify-center text-[#999] cursor-pointer bg-white transition-all duration-300 ease-custom hover:bg-[#f5f5f5] hover:text-[#333] hover:border-[#ccc]">
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

