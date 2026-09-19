import React from 'react';

const SizeButton = ({ size, selectedSize, onClick, className = '', disabled = false }) => {
  return (
    <button
      disabled={disabled}
      className={`p-3 border-[1.5px] border-black rounded-lg font-semibold text-[0.85rem] transition-all duration-300 ease-custom ${disabled ? 'opacity-30 cursor-not-allowed bg-gray-100 border-gray-300 text-gray-500' : selectedSize === size ? 'border-[#111] bg-[#BEBEBE]' : 'hover:bg-gray-50'} ${className}`}
      onClick={() => onClick(size)}
    >
      {size}
    </button>
  );
};

export default SizeButton;
