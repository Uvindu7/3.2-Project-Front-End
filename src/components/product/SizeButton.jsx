import React from 'react';

const SizeButton = ({ size, selectedSize, onClick, className = '' }) => {
  return (
    <button
      className={`p-3 border-[1.5px] border-black rounded-lg font-semibold text-[0.85rem] transition-all duration-300 ease-custom ${selectedSize === size ? 'border-[#111] bg-[#BEBEBE]' : 'hover:border-[#]'} ${className}`}
      onClick={() => onClick(size)}
    >
      {size}
    </button>
  );
};

export default SizeButton;
