import React, { useState } from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({
  products,
  onQuickAdd,
  onToggleWishlist,
  onRemoveProduct,
  sortBy,
  setSortBy
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex-1 text-left">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-zinc-100 pb-4 mb-6">
        <div>
          <h2 className="font-outfit text-2xl font-extrabold tracking-wide text-zinc-900 uppercase">
            Shop Collection
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Explore the latest trends with unique designs.
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center gap-2 self-start sm:self-auto">
          <span className="font-outfit text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
            Sort By:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold text-zinc-800 bg-transparent border border-zinc-200 rounded px-2.5 py-1 focus:outline-none focus:border-black cursor-pointer transition"
          >
            <option value="featured">Featured</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickAdd={onQuickAdd}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-1 mt-12 border-t border-zinc-100 pt-6">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          className="border border-zinc-200 text-zinc-600 hover:border-black hover:text-black w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-sm transition"
        >
          &lt;
        </button>
        <span className="font-outfit text-xs font-bold text-zinc-800 border border-zinc-200 px-3 py-2 rounded-sm bg-white min-w-[36px] text-center">
          {currentPage}/6
        </span>
        <button
          onClick={() => setCurrentPage(Math.min(6, currentPage + 1))}
          className="border border-zinc-200 text-zinc-600 hover:border-black hover:text-black w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-sm transition"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default ProductGrid;
