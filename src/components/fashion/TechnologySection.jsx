import React from "react";

// Replace these placeholders with your actual image paths from your assets folder
import closetImg from "../../assets/images/closet.jpg";
import fabricImg from "../../assets/images/fabric-detail.jpg";

function TechnologySection() {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 px-6 lg:px-24 py-12 lg:py-20 font-sans bg-white max-w-[1440px] mx-auto box-border text-center lg:text-left">
      
      {/* LEFT SIDE: Visual Grid Dashboard */}
      <div className="flex-[1.2] grid grid-cols-[1.1fr_1fr] grid-rows-[auto_auto] gap-4 w-full max-w-[600px] text-left">
        
        {/* Top Left: Wardrobe/Closet View */}
        <div className="col-start-1 row-start-1 rounded overflow-hidden relative">
          <img src={closetImg} alt="Wardrobe Selection" className="w-full h-full object-cover block" />
        </div>

        {/* Top Right: Color Theory Ratio Indicator */}
        <div className="col-start-2 row-start-1 rounded overflow-hidden relative bg-[#1a1919] p-6 flex flex-col justify-start">
          <span className="text-gray-500 text-[0.75rem] font-semibold tracking-wider mb-3">COLOR THEORY RATIO</span>
          <div className="w-full h-[5px] bg-gray-700 rounded-sm mb-6 relative">
            <div className="absolute right-0 top-0 h-full w-[30%] bg-[#0046e2] rounded-r-sm"></div>
          </div>
          <p className="text-gray-400 text-[0.85rem] leading-relaxed m-0">
            Optimal contrast detected<br />for Obsidian Black T-shirt.
          </p>
        </div>

        {/* Bottom Left: AI Pairing Active Banner */}
        <div className="col-start-1 row-start-2 rounded overflow-hidden relative bg-[#0046e2] aspect-[4/3] flex items-center justify-center">
          <div className="text-center text-white">
            <span className="block text-2xl mb-2">✦✦</span>
            <span className="text-[0.8rem] font-semibold tracking-wider uppercase">AI PAIRING ACTIVE</span>
          </div>
        </div>

        {/* Bottom Right: Fabric / Trouser Detail View */}
        <div className="col-start-2 row-start-2 rounded overflow-hidden relative">
          <img src={fabricImg} alt="Trouser Fabric Close-up" className="w-full h-full object-cover block" />
        </div>

      </div>

      {/* RIGHT SIDE: Text & Feature Details */}
      <div className="flex-1 max-w-full lg:max-w-[520px] text-left">
        <span className="text-[#0046e2] font-semibold text-sm block mb-3 uppercase tracking-wider">The LIYARA Intelligence</span>
        
        <h2 className="text-4xl lg:text-[2.6rem] font-bold text-gray-900 mb-6 tracking-tighter">Chromatic Harmony.</h2>
        
        <p className="text-gray-600 text-base leading-relaxed mb-10">
          Fashion is a language of color and proportion. Our proprietary AI doesn't 
          just recommend clothes—it understands color theory.
        </p>

        {/* Features List */}
        <div className="flex flex-col gap-8">
          
          <div className="flex gap-4 items-start">
            <div className="text-xl text-gray-800 pt-1">🎨</div>
            <div className="text-gray-900">
              <h3 className="m-0 mb-2 text-base font-bold">Dynamic Complementary Selection</h3>
              <p className="m-0 text-sm text-gray-600 leading-relaxed">
                The system analyzes the hex-code of your selected T-shirt and 
                cross-references it with our trousers collection to find the perfect 
                chromatic balance.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="text-xl text-gray-800 pt-1">⌨</div>
            <div className="text-gray-900">
              <h3 className="m-0 mb-2 text-base font-bold">Proportional Fit Engine</h3>
              <p className="m-0 text-sm text-gray-600 leading-relaxed">
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