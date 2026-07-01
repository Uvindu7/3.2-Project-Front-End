import React, { useState } from 'react';
import SidebarFilters from './SidebarFilters';
import ProductGrid from './ProductGrid';
import RecentlyViewed from './RecentlyViewed';

const Shop = ({ onProductClick }) => {
  // Filter & Sort State
  const [activeCategory, setActiveCategory] = useState('All Collection');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [availability, setAvailability] = useState({ inStock: true, outOfStock: false });
  const [fit, setFit] = useState({ slimFit: false, baggy: false });
  const [sortBy, setSortBy] = useState('featured');

  // Sample Product Data
  const [products] = useState([
    { id: 1, name: 'Raglan Tee - Classic White', price: 2900, image: '/images/charcoal-tee.png', category: 'New Arrivals' },
    { id: 2, name: 'Raglan Tee - Deep Black', price: 3200, image: '/images/product-tee.png', category: 'Best Sellers' },
    { id: 3, name: 'Raglan Tee - Charcoal', price: 2800, image: '/images/product-tee.png', category: "Men's Collection" },
    { id: 4, name: 'Raglan Tee - Heather Grey', price: 2700, image: '/images/product-tee.png', category: 'All Collection' },
    { id: 5, name: 'Raglan Tee - Navy Blue', price: 3000, image: '/images/product-tee.png', category: 'New Arrivals' },
    { id: 6, name: 'Raglan Tee - Forest Green', price: 3100, image: '/images/product-tee.png', category: 'Best Sellers' },
  ]);

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleAvailability = (key) => {
    setAvailability(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFit = (key) => {
    setFit(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleQuickAdd = (product) => {
    console.log('Quick Add:', product);
    // You can implement cart logic here
  };

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <SidebarFilters
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              selectedSizes={selectedSizes}
              toggleSize={toggleSize}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              availability={availability}
              toggleAvailability={toggleAvailability}
              fit={fit}
              toggleFit={toggleFit}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <ProductGrid
              products={products}
              onQuickAdd={handleQuickAdd}
              onToggleWishlist={(id) => console.log('Toggle wishlist:', id)}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
            
            <div className="mt-20">
              <RecentlyViewed onQuickAdd={handleQuickAdd} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
