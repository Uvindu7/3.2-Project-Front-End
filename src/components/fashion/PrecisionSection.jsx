import React from "react";

// Replace with your actual image path (the raglan t-shirt image from the mockup)
import tshirtImage from "../../assets/images/tshirt.jpg"; 

function PrecisionSection() {
  return (
    <section className="flex flex-col-reverse lg:flex-row items-center justify-between gap-16 px-8 py-16 lg:px-24 lg:py-16 font-sans bg-white max-w-[1440px] mx-auto box-border">
      {/* Left Column: Text & Parameter Grid */}
      <div className="flex-1 max-w-full lg:max-w-[500px] w-full">
        <span className="text-blue-600 font-semibold text-sm tracking-widest uppercase block mb-3">TAILORED INTELLIGENCE</span>
        
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">The Precision Fit.</h2>
        
        <p className="text-gray-600 text-base leading-relaxed mb-10">
          No more guesswork. Input your unique body parameters and let our AI 
          determine your perfect silhouette across our entire collection.
        </p>

        {/* Measurement Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 border border-gray-200 rounded-md p-4 bg-white cursor-pointer transition-all duration-200 hover:border-gray-400 hover:shadow-sm">
            <span className="text-gray-800 text-xl flex items-center justify-center w-6">⚿</span>
            <span className="text-gray-900 text-[0.95rem] font-medium">Chest Width</span>
          </div>
          <div className="flex items-center gap-3 border border-gray-200 rounded-md p-4 bg-white cursor-pointer transition-all duration-200 hover:border-gray-400 hover:shadow-sm">
            <span className="text-gray-800 text-xl flex items-center justify-center w-6">↕</span>
            <span className="text-gray-900 text-[0.95rem] font-medium">Upper Body Length</span>
          </div>
          <div className="flex items-center gap-3 border border-gray-200 rounded-md p-4 bg-white cursor-pointer transition-all duration-200 hover:border-gray-400 hover:shadow-sm">
            <span className="text-gray-800 text-xl flex items-center justify-center w-6">📐</span>
            <span className="text-gray-900 text-[0.95rem] font-medium">Shoulder Width</span>
          </div>
          <div className="flex items-center gap-3 border border-gray-200 rounded-md p-4 bg-white cursor-pointer transition-all duration-200 hover:border-gray-400 hover:shadow-sm">
            <span className="text-gray-800 text-xl flex items-center justify-center w-6">◯</span>
            <span className="text-gray-900 text-[0.95rem] font-medium">Neck Size</span>
          </div>
          <div className="col-span-2 flex items-center gap-3 border border-gray-200 rounded-md p-4 bg-white cursor-pointer transition-all duration-200 hover:border-gray-400 hover:shadow-sm">
            <span className="text-gray-800 text-xl flex items-center justify-center w-6">⚬—⚬</span>
            <span className="text-gray-900 text-[0.95rem] font-medium">Sleeve Length</span>
          </div>
        </div>
      </div>

      {/* Right Column: Visual Preview */}
      <div className="flex-[1.2] flex items-center justify-center w-full">
        <div className="relative w-full max-h-[350px] lg:max-h-[420px] rounded overflow-hidden flex">
          <img 
            src={tshirtImage} 
            alt="The Precision Fit Showcase" 
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle sparkles icon in the bottom right corner */}
          <div className="absolute bottom-4 right-4 text-gray-400 text-xl pointer-events-none">✦</div>
        </div>
      </div>
    </section>
  );
}

export default PrecisionSection;