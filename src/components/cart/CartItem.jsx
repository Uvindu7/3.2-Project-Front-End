import React from "react";

const CartItem = ({ item, increaseQty, decreaseQty, removeItem }) => {
  const isOOS = item.maxStock === 0;
  const isMaxStockReached = item.quantity >= item.maxStock;
  
  const basePrice = Number(item.price);
  const isWholesale = item.quantity >= 10 && item.wholesaleDiscountPercent > 0;
  const hasNormalDiscount = !isWholesale && item.discountPercent > 0;
  
  let effectivePrice = basePrice;
  if (isWholesale) {
    effectivePrice = basePrice * (1 - item.wholesaleDiscountPercent / 100);
  } else if (hasNormalDiscount) {
    effectivePrice = basePrice * (1 - item.discountPercent / 100);
  }

  return (
    <div className={`flex flex-col md:flex-row gap-6 p-6 bg-white border border-gray-200 hover:shadow-lg transition rounded-xl ${isOOS ? 'opacity-50 grayscale' : ''}`}>
      {/* Product Image */}
      <div className="w-full md:w-44 aspect-square bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start gap-4">
          <div>
            <p className="uppercase text-xs tracking-widest text-blue-600 font-semibold mb-1">
              {item.collection}
            </p>
            <h2 className="text-xl font-bold text-zinc-900 leading-tight">
              {item.name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Color: <span className="font-medium">{item.color}</span> / Size:{" "}
              <span className="font-medium">{item.size}</span>
            </p>
            {item.maxStock > 0 && item.maxStock < 10 && (
              <p className="text-red-500 text-xs font-bold mt-2">Only {item.maxStock} left in stock!</p>
            )}
            {isOOS && (
              <p className="text-red-500 text-xs font-bold mt-2">Out of stock</p>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-gray-400 mb-0.5">Total</p>
            <h3 className="text-xl font-bold text-zinc-900">
              Rs {(effectivePrice * item.quantity).toLocaleString()}
            </h3>
            {isWholesale && (
              <p className="text-xs font-bold text-green-600 mb-1 bg-green-50 px-2 py-1 rounded inline-block">
                {item.wholesaleDiscountPercent}% Wholesale Discount!
              </p>
            )}
            {hasNormalDiscount && (
              <p className="text-xs font-bold text-green-600 mb-1 bg-green-50 px-2 py-1 rounded inline-block">
                {item.discountPercent}% OFF!
              </p>
            )}
            <div className="text-xs text-gray-400 flex flex-col items-end">
               {(isWholesale || hasNormalDiscount) ? (
                 <>
                   <span className="line-through text-red-400">Rs {basePrice.toLocaleString()}</span>
                   <span>Rs {effectivePrice.toLocaleString()} each</span>
                 </>
               ) : (
                 <span>Rs {basePrice.toLocaleString()} each</span>
               )}
            </div>
          </div>
        </div>

        {/* Quantity Controls & Remove */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden">
            <button
              onClick={() => decreaseQty(item.id)}
              className="px-4 py-2.5 text-lg font-semibold hover:bg-gray-100 transition-colors text-zinc-700"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="px-5 py-2 text-sm font-bold min-w-[40px] text-center border-x border-zinc-200">
              {item.quantity}
            </span>
            <button
              onClick={() => increaseQty(item.id)}
              disabled={isMaxStockReached || isOOS}
              className={`px-4 py-2.5 text-lg font-semibold transition-colors ${isMaxStockReached || isOOS ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 text-zinc-700'}`}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            onClick={() => removeItem(item.id)}
            className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-700 transition-colors"
            aria-label="Remove item"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
