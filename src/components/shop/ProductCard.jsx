import React from 'react';

const ProductCard = ({
  product,
  onQuickAdd,
  onToggleWishlist,
  showARIcon = true
}) => {
  return (
    <div className="group relative flex flex-col">
      {/* Image Container */}
      <div 
        className="aspect-[3/4] w-full bg-zinc-100 rounded-sm overflow-hidden relative border border-zinc-100"
        style={{ backgroundColor: product.color || 'transparent' }}
      >
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
            product.color ? 'mix-blend-multiply opacity-90' : product.filterClass || ''
          }`}
        />

        {/* Red Dot (Specifically for Product 11) */}
        {product.hasRedDot && (
          <div className="absolute top-[55%] left-[55%] w-2 h-2 bg-red-600 rounded-full shadow-md animate-pulse"></div>
        )}

        {/* Top Right AR/3D View Icon */}
        {showARIcon && (
          <div 
            className="absolute top-3 right-3 bg-black text-white rounded-full w-9 h-9 flex items-center justify-center shadow-md select-none transition hover:scale-105 duration-200 cursor-pointer" 
            aria-label="3D View"
          >
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
        )}

        {/* Bottom Quick Add Banner */}
        <div className="absolute bottom-0 left-0 right-0">
          <button
            onClick={() => onQuickAdd(product)}
            className="w-full bg-[#c0c0c0] hover:bg-[#b0b0b0] text-black font-outfit text-sm font-extrabold tracking-widest py-3.5 transition-colors duration-200 uppercase"
          >
            QUICK ADD
          </button>
        </div>
      </div>

      {/* Details Area */}
      <div className="mt-3.5 text-left">
        {/* Title & Wishlist Button Row */}
        <div className="flex justify-between items-center">
          <h3 className="font-outfit text-base font-bold text-zinc-900 tracking-wide">
            {product.name}
          </h3>
          {/* Heart Wishlist Button */}
          <button
            onClick={() => onToggleWishlist(product.id)}
            className={`transition-colors p-1 ${
              product.wishlisted ? 'text-red-500' : 'text-zinc-400 hover:text-red-500'
            }`}
            aria-label="Toggle wishlist"
          >
            <svg
              className="w-5 h-5 transition-colors duration-200"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill={product.wishlisted ? "currentColor" : "none"}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Subtitle / Description Row */}
        <p className="text-xs font-sans text-zinc-500 leading-normal mt-0.5 font-medium">
          {product.description}
        </p>

        {/* Price & Status Row */}
        <div className="flex items-center gap-3 mt-2">
          <span className="font-outfit text-sm font-extrabold text-zinc-900">
            Rs {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="font-outfit text-xs font-semibold text-zinc-400 line-through">
              Rs {product.originalPrice.toLocaleString()}
            </span>
          )}
          {product.status && (
            <span className="text-[9px] font-semibold text-zinc-500 border border-zinc-200 px-1.5 py-0.5 rounded-sm uppercase tracking-wider bg-zinc-50">
              {product.status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
