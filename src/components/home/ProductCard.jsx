import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ id, image, name, price, added, product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(added);
  const [selectedSize, setSelectedSize] = useState('M');
  const sizes = ['S', 'M', 'L'];
  
  const totalStock = product ? ((product.stockS || 0) + (product.stockM || 0) + (product.stockL || 0)) : 1;
  const isOOS = totalStock === 0;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    setIsAdded(true);
    
    if (isOOS) return;

    let maxStock = 10;
    if (product) {
      if (selectedSize === 'S') maxStock = product.stockS;
      else if (selectedSize === 'M') maxStock = product.stockM;
      else if (selectedSize === 'L') maxStock = product.stockL;
    }

    addToCart({
      id,
      name,
      image,
      price: price || 0,
      size: selectedSize,
      color: 'Default',
      maxStock: maxStock || 0
    });
    
    // Slight delay so they can see the "ADDED" state before navigation
    setTimeout(() => {
      navigate('/cart');
    }, 300);
  };

  return (
    <div className={`w-full overflow-hidden bg-white transition-all duration-300 ease-custom group h-full cursor-pointer flex flex-col ${isOOS ? 'opacity-50 grayscale' : ''}`} onClick={() => navigate(id ? `/product/${id}` : '/shop')}>
      <div className="relative bg-[#f7f7f7] flex items-center justify-center overflow-hidden flex-1">
        <img src={image} alt={name} className="w-full h-full object-contain transition-all duration-300 ease-custom group-hover:scale-105" />
        {/* Price Tag */}
        {(price || price === 0) && (
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg z-[2] border border-white/10">
            <span className="font-outfit text-[0.75rem] font-extrabold text-white tracking-wider">
              RS {price.toLocaleString()}
            </span>
          </div>
        )}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-md text-zinc-600 z-[2] hover:bg-white hover:text-red-500 hover:scale-110 transition-all duration-300" onClick={(e) => e.stopPropagation()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      <div className="w-full p-0 transition-all duration-300 ease-custom bg-white">
        {/* Size Selection */}
        <div className="flex justify-center items-center gap-2 py-3 border-t border-zinc-100 bg-zinc-50/50 backdrop-blur-sm group-hover:bg-white transition-colors duration-300" onClick={(e) => e.stopPropagation()}>
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-8 h-8 text-[0.65rem] font-black rounded-full flex items-center justify-center transition-all duration-300 ${
                selectedSize === size 
                  ? 'bg-black text-white shadow-md scale-110 ring-2 ring-black/20 ring-offset-1' 
                  : 'bg-white text-zinc-500 border border-zinc-200 hover:border-black/30 hover:text-black hover:shadow-sm'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        <button
          disabled={isOOS}
          className={`w-full py-3.5 font-bold text-[0.75rem] tracking-[0.15em] border-none cursor-pointer transition-all duration-300 ease-custom ${
            isOOS ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed' :
            isAdded 
              ? 'bg-emerald-500 text-white shadow-inner' 
              : 'bg-[#f4f4f4] text-zinc-500 lg:group-hover:bg-black lg:group-hover:text-white'
          }`}
          onClick={handleQuickAdd}
        >
          {isOOS ? 'OUT OF STOCK' : isAdded ? 'ADDED ✓' : 'QUICK ADD'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

