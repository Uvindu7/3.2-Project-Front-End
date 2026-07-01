import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarFilters from './SidebarFilters';
import ProductGrid from './ProductGrid';
import RecentlyViewed from './RecentlyViewed';
import { useCart } from '../../context/CartContext';

const Shop = ({ onProductClick }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  // Filter & Sort State
  const [activeCategory, setActiveCategory] = useState('All Collection');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [appliedSizes, setAppliedSizes] = useState([]);
  const [pendingPriceRange, setPendingPriceRange] = useState({ min: 0, max: 5000 });
  const [appliedPriceRange, setAppliedPriceRange] = useState({ min: 0, max: 5000 });
  const [availability, setAvailability] = useState({ inStock: true, outOfStock: false });
  const [fit, setFit] = useState({ slimFit: false, baggy: false });
  const [sortBy, setSortBy] = useState('featured');

  // Sample Product Data
  const [products] = useState([
    { id: 1, name: 'Raglan Tee - Classic White', price: 2900, image: '/images/charcoal-tee.png', category: 'New Arrivals', sizes: ['S', 'M', 'L'] },
    { id: 2, name: 'Raglan Tee - Deep Black', price: 3200, image: '/images/product-tee.png', category: 'Best Sellers', sizes: ['M', 'L', 'XL'] },
    { id: 3, name: 'Raglan Tee - Charcoal', price: 2800, image: '/images/product-tee.png', category: "Men's Collection", sizes: ['L', 'XL', 'XXL'] },
    { id: 4, name: 'Raglan Tee - Heather Grey', price: 2700, image: '/images/product-tee.png', category: 'All Collection', sizes: ['S', 'M', 'XXL'] },
    { id: 5, name: 'Raglan Tee - Navy Blue', price: 3000, image: '/images/product-tee.png', category: 'New Arrivals', sizes: ['XL', 'XXL', '3XL'] },
    { id: 6, name: 'Raglan Tee - Forest Green', price: 3100, image: '/images/product-tee.png', category: 'Best Sellers', sizes: ['S', 'M', '3XL'] },
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

  const handleApplyFilters = () => {
    setAppliedSizes(selectedSizes);
    setAppliedPriceRange(pendingPriceRange);
  };

  const handleClearFilters = () => {
    setSelectedSizes([]);
    setAppliedSizes([]);
    setPendingPriceRange({ min: 0, max: 5000 });
    setAppliedPriceRange({ min: 0, max: 5000 });
    setAvailability({ inStock: true, outOfStock: false });
    setFit({ slimFit: false, baggy: false });
    setActiveCategory('All Collection');
  };

  const handleQuickAdd = (product) => {
    addToCart({
      ...product,
      size: 'M',
      color: product.color || 'Default',
      collection: 'LIYARA',
    });
    navigate('/cart');
  };

  // Filtered Products
  const filteredProducts = products.filter(product => {
    // Size filter
    if (appliedSizes.length > 0) {
      const hasSize = product.sizes && product.sizes.some(size => appliedSizes.includes(size));
      if (!hasSize) return false;
    }
    // Price range filter
    const maxPrice = parseInt(appliedPriceRange.max, 10) || 5000;
    const minPrice = parseInt(appliedPriceRange.min, 10) || 0;
    if (product.price < minPrice || product.price > maxPrice) {
      return false;
    }
    // Category filter
    if (activeCategory !== 'All Collection' && activeCategory !== 'Recently Viewed') {
      if (product.category !== activeCategory) return false;
    }
    return true;
  });

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
              priceRange={pendingPriceRange}
              setPriceRange={setPendingPriceRange}
              availability={availability}
              toggleAvailability={toggleAvailability}
              fit={fit}
              toggleFit={toggleFit}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <ProductGrid
              products={filteredProducts}
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
