import React, { useState } from 'react';

const SidebarFilters = ({
  activeCategory,
  setActiveCategory,
  selectedSizes,
  toggleSize,
  priceRange,
  setPriceRange,
  availability,
  toggleAvailability,
  fit,
  toggleFit
}) => {
  const categories = [
    'All Collection',
    'New Arrivals',
    'Best Sellers',
    "Men's Collection",
    "Women's Collection",
    "Kids' Collection",
    'Recently Viewed'
  ];

  const sizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

  // Personalized Fit calculator states
  const [chestWidth, setChestWidth] = useState('');
  const [shoulderWidth, setShoulderWidth] = useState('');
  const [upperBodyLength, setUpperBodyLength] = useState('');
  const [fitRecommendation, setFitRecommendation] = useState('');

  const handleCalculateFit = () => {
    const chest = parseFloat(chestWidth);
    if (!chest || isNaN(chest)) {
      setFitRecommendation('Please enter a valid chest width.');
      return;
    }
    let recommendedSize = 'M';
    if (chest < 48) recommendedSize = 'S';
    else if (chest >= 48 && chest < 52) recommendedSize = 'M';
    else if (chest >= 52 && chest < 56) recommendedSize = 'L';
    else if (chest >= 56 && chest < 60) recommendedSize = 'XL';
    else if (chest >= 60 && chest < 64) recommendedSize = 'XXL';
    else recommendedSize = '3XL';

    setFitRecommendation(`We recommend size ${recommendedSize} for you!`);
  };

  return (
    <aside className="w-full text-left font-sans">
      {/* Explore Section */}
      <div className="mb-8">
        <h3 className="font-outfit text-xs font-bold tracking-widest text-zinc-900 mb-4 uppercase">
          Explore
        </h3>
        <ul className="space-y-3">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => setActiveCategory(cat)}
                className={`text-sm text-left flex items-center justify-between w-full transition-all duration-200 ${
                  activeCategory === cat
                    ? 'text-black font-semibold translate-x-1'
                    : 'text-zinc-500 hover:text-black hover:translate-x-1'
                }`}
              >
                <span>{cat}</span>
                {cat === 'Best Sellers' && (
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full inline-block mr-2 animate-pulse"></span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Personalized Fit Section */}
      <div className="bg-[#f4f4f4] border border-zinc-200 rounded-sm p-4 mb-8">
        <div className="flex items-center gap-2 mb-4">
          {/* Ruler Icon */}
          <svg
            className="w-4 h-4 text-zinc-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="7" width="20" height="10" rx="2" ry="2" />
            <line x1="6" y1="7" x2="6" y2="12" />
            <line x1="10" y1="7" x2="10" y2="12" />
            <line x1="14" y1="7" x2="14" y2="12" />
            <line x1="18" y1="7" x2="18" y2="12" />
          </svg>
          <span className="font-outfit text-xs font-bold tracking-widest text-zinc-900 uppercase">
            Personalized Fit
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-semibold text-zinc-500 mb-1 uppercase tracking-wider">
              Chest Width (CM)
            </label>
            <input
              type="text"
              placeholder="e.g. 52"
              value={chestWidth}
              onChange={(e) => setChestWidth(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-black transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-zinc-500 mb-1 uppercase tracking-wider">
              Shoulder Width (CM)
            </label>
            <input
              type="text"
              placeholder="e.g. 46"
              value={shoulderWidth}
              onChange={(e) => setShoulderWidth(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-black transition"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-zinc-500 mb-1 uppercase tracking-wider">
              Upper Body Length (CM)
            </label>
            <input
              type="text"
              placeholder="e.g. 72"
              value={upperBodyLength}
              onChange={(e) => setUpperBodyLength(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded px-2.5 py-1.5 text-xs text-zinc-800 focus:outline-none focus:border-black transition"
            />
          </div>

          <button
            onClick={handleCalculateFit}
            className="w-full bg-black hover:bg-zinc-800 text-white font-outfit text-xs font-bold tracking-widest py-3 rounded-sm mt-1 transition-colors duration-200 uppercase"
          >
            Calculate Fit
          </button>

          {fitRecommendation && (
            <div className="mt-3 text-center text-xs font-extrabold text-zinc-900 border-t border-zinc-200 pt-3 animate-fade-in">
              {fitRecommendation}
            </div>
          )}
        </div>
      </div>

      {/* Refine By Section */}
      <div>
        <h3 className="font-outfit text-xs font-bold tracking-widest text-zinc-900 mb-4 uppercase border-b border-zinc-100 pb-2">
          Refine By
        </h3>

        {/* Size Filter */}
        <div className="mb-6">
          <span className="block text-xs font-semibold text-zinc-800 mb-3 uppercase">
            Size
          </span>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((size) => {
              const isSelected = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`border py-1.5 text-center text-xs transition-colors duration-200 rounded-sm font-medium ${
                    isSelected
                      ? 'bg-black border-black text-white'
                      : 'bg-white border-zinc-200 text-zinc-700 hover:border-black'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <span className="block text-xs font-semibold text-zinc-800 mb-3 uppercase">
            Price Range
          </span>
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={priceRange.max || 5000}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black mb-3"
          />
          <div className="flex justify-between text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">
            <span>Rs 0</span>
            <span>Rs {priceRange.max || 5000}</span>
          </div>
        </div>

        {/* Availability Filter */}
        <div className="mb-6">
          <span className="block text-xs font-semibold text-zinc-800 mb-3 uppercase">
            Availability
          </span>
          <div className="space-y-2.5">
            <label className="flex items-center gap-3 cursor-pointer group text-xs text-zinc-700 hover:text-black font-medium">
              <input
                type="checkbox"
                checked={availability.inStock}
                onChange={() => toggleAvailability('inStock')}
                className="w-4 h-4 border border-zinc-300 bg-white rounded-sm checked:bg-black checked:border-black appearance-none relative flex items-center justify-center after:content-['✓'] after:text-[10px] after:text-white after:font-bold after:hidden checked:after:block cursor-pointer transition-colors"
              />
              <span>In Stock</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group text-xs text-zinc-700 hover:text-black font-medium">
              <input
                type="checkbox"
                checked={availability.outOfStock}
                onChange={() => toggleAvailability('outOfStock')}
                className="w-4 h-4 border border-zinc-300 bg-white rounded-sm checked:bg-black checked:border-black appearance-none relative flex items-center justify-center after:content-['✓'] after:text-[10px] after:text-white after:font-bold after:hidden checked:after:block cursor-pointer transition-colors"
              />
              <span>Out of Stock</span>
            </label>
          </div>
        </div>

        {/* Fit Filter */}
        <div>
          <span className="block text-xs font-semibold text-zinc-800 mb-3 uppercase">
            Fit
          </span>
          <div className="space-y-2.5">
            <label className="flex items-center gap-3 cursor-pointer group text-xs text-zinc-700 hover:text-black font-medium">
              <input
                type="checkbox"
                checked={fit.slimFit}
                onChange={() => toggleFit('slimFit')}
                className="w-4 h-4 border border-zinc-300 bg-white rounded-sm checked:bg-black checked:border-black appearance-none relative flex items-center justify-center after:content-['✓'] after:text-[10px] after:text-white after:font-bold after:hidden checked:after:block cursor-pointer transition-colors"
              />
              <span>Slim Fit</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group text-xs text-zinc-700 hover:text-black font-medium">
              <input
                type="checkbox"
                checked={fit.baggy}
                onChange={() => toggleFit('baggy')}
                className="w-4 h-4 border border-zinc-300 bg-white rounded-sm checked:bg-black checked:border-black appearance-none relative flex items-center justify-center after:content-['✓'] after:text-[10px] after:text-white after:font-bold after:hidden checked:after:block cursor-pointer transition-colors"
              />
              <span>Baggy</span>
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarFilters;
