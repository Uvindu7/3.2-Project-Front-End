import React, { useState } from 'react';

const ProductCard = ({ image, name, added, onClick }) => {
  const [isAdded, setIsAdded] = useState(added);

  return (
    <div className="w-full overflow-hidden bg-white transition-all duration-300 ease-custom group h-full cursor-pointer flex flex-col" onClick={onClick}>
      <div className="relative bg-[#f7f7f7] flex items-center justify-center overflow-hidden flex-1">
        <img src={image} alt={name} className="w-full h-full object-contain transition-all duration-300 ease-custom group-hover:scale-105" />
        <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-[#333] z-[2] hover:bg-[#333] hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      <div className="w-full p-0 transition-all duration-300 ease-custom">
        <button
          className={`w-full p-2 font-bold text-[0.75rem] tracking-[0.1em] border-none cursor-pointer transition-all duration-300 ease-custom ${isAdded ? 'bg-black text-white' : 'bg-[#ccc] text-[#111] lg:group-hover:bg-black lg:group-hover:text-white'}`}
          onClick={(e) => { e.stopPropagation(); setIsAdded(!isAdded); }}
        >
          {isAdded ? 'ADDED' : 'QUICK ADD'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

