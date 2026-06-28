import React, { useState } from 'react';
import ProductSection from '../home/ProductSection';

const ProductDetails = ({ onBack }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Deep Charcoal');

  const colors = [
    { name: 'Black', hex: '#111' },
    { name: 'Light Grey', hex: '#ddd' },
    { name: 'Deep Charcoal', hex: '#333' }
  ];

  const sizes = ['S', 'M', 'L', 'XL'];

  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="container">
        <div className="mb-8">
          <button className="flex items-center gap-2 text-[0.85rem] text-[#666] font-medium transition-all duration-300 ease-custom hover:text-[#111] hover:-translate-x-1 border-none bg-transparent" onClick={onBack}>
            <span>←</span> Back to Browse
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-16 items-start mb-32">
          {/* Product Image Section */}
          <div className="w-full">
            <div className="bg-[#f7f7f7] rounded-[20px] p-8 md:p-16 relative aspect-square flex items-center justify-center overflow-hidden group">
              <span className="absolute top-6 right-6 bg-black/80 text-white px-4 py-2 rounded-full text-[0.7rem] font-bold tracking-wider flex items-center gap-2 backdrop-blur-md z-10">
                <span className="icon">🎮</span> 3D INTERACTIVE
              </span>
              <img 
                src="/images/charcoal-tee.png" 
                alt="Comfort Fit Crew Neck T Shirt" 
                className="max-w-full max-h-full object-contain transition-transform duration-500 ease-custom group-hover:scale-105"
              />
            </div>
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col gap-6">
            <span className="text-[0.75rem] font-bold text-[#888] tracking-[0.1em]">POPULAR MENS</span>
            <h1 className="text-[2.2rem] font-extrabold leading-[1.2] text-[#111] font-outfit">Comfort Fit Crew Neck T Shirt</h1>
            <h2 className="text-2xl font-bold text-[#111] -mt-2">RS 2900.00</h2>

            <p className="text-[#666] text-[0.95rem] leading-relaxed mt-4 font-sans">
              Manufactured from 240GSM heavyweight organic cotton. 
              A structured drape meets effortless comfort. 
              Features a reinforced ribbed collar and a slightly dropped shoulder for 
              a modern, architectural silhouette.
            </p>

            <div className="mt-4 flex flex-col gap-4">
              <span className="text-[0.8rem] font-bold text-[#333]">COLOR: {selectedColor.toUpperCase()}</span>
              <div className="flex gap-3">
                {colors.map(color => (
                  <button 
                    key={color.name}
                    className={`w-8 h-8 rounded-full border border-transparent transition-all duration-300 ease-custom relative ${selectedColor === color.name ? 'border-[#111] shadow-[inset_0_0_0_2px_white]' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-[0.8rem] font-bold text-[#333]">SIZE</span>
                <button className="text-[0.75rem] text-[#666] underline font-medium border-none bg-transparent">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {sizes.map(size => (
                  <button 
                    key={size}
                    className={`p-3 border-[1.5px] border-[#eee] rounded-lg font-semibold text-[0.85rem] transition-all duration-300 ease-custom ${selectedSize === size ? 'border-[#111] bg-[#f9f9f9]' : 'hover:border-[#333]'}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <div className="flex items-center border-[1.5px] border-[#eee] rounded-lg overflow-hidden">
                <button className="px-5 py-3 text-xl text-[#333] border-none bg-transparent" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span className="px-4 font-bold min-w-[40px] text-center">{quantity}</span>
                <button className="px-5 py-3 text-xl text-[#333] border-none bg-transparent" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <button className="flex-1 bg-black text-white rounded-lg font-bold text-[0.9rem] tracking-wider flex items-center justify-center gap-3">
                ADD TO CART <span>🛒</span>
              </button>
            </div>

            <button className="w-full p-5 border-[1.5px] border-[#111] rounded-lg font-bold text-[0.9rem] tracking-wider transition-all duration-300 ease-custom hover:bg-[#f5f5f5] bg-transparent">BUY NOW</button>

            <div className="mt-8 flex flex-col gap-4 pt-8 border-t border-[#eee]">
              <div className="flex items-center gap-4 text-[0.85rem] text-[#555] font-medium">
                <span className="icon">🚚</span>
                <span>Complimentary Express Shipping</span>
              </div>
              <div className="flex items-center gap-4 text-[0.85rem] text-[#555] font-medium">
                <span className="icon">🌿</span>
                <span>100% GOTS Certified Organic Cotton</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation Sections */}
        <div className="flex flex-col gap-16">
          <ProductSection 
            title="SMART RECOMMENDATIONS" 
            description="Explore the latest trends and must-haves. Shop now and stay stylish with our fresh collection!" 
            onProductClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          />
          <ProductSection 
            title="RELATED PRODUCTS" 
            description="Explore the latest trends and must-haves. Shop now and stay stylish with our fresh collection!" 
            onProductClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          />
          <ProductSection 
            title="RECENTLY VIEWED PRODUCTS" 
            description="Explore the latest trends and must-haves. Shop now and stay stylish with our fresh collection!" 
            onProductClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

