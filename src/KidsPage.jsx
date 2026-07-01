import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarFilters from './components/shop/SidebarFilters';
import ProductGrid from './components/shop/ProductGrid';
import { useCart } from './context/CartContext';

const KidsPage = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("Kid's Collection");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [availability, setAvailability] = useState({ inStock: true, outOfStock: false });
  const [fit, setFit] = useState({ slimFit: false, baggy: false });
  const [sortBy, setSortBy] = useState('featured');

  // Sample Product Data (Filtered for Kids)
  const [products] = useState([
    { id: 301, name: 'Kids’ Graphic Tee - Dino', price: 1900, image: '/images/product-tee.png', category: "Kid's Collection" },
    { id: 302, name: 'Kids’ Stripe Tee - Blue/White', price: 2100, image: '/images/product-tee.png', category: "Kid's Collection" },
    { id: 303, name: 'Kids’ Soft Cotton Tee - Teal', price: 1800, image: '/images/charcoal-tee.png', category: "Kid's Collection" },
    { id: 304, name: 'Kids’ Active Tee - Red', price: 2200, image: '/images/product-tee.png', category: "Kid's Collection" },
  ]);

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleQuickAdd = (product) => {
    addToCart({ ...product, size: 'XS', color: 'Default', collection: 'LIYARA' });
    navigate('/cart');
  };

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold font-outfit text-[#111] mb-2 uppercase tracking-tight">KIDS' COLLECTION</h1>
          <p className="text-gray-500 max-w-2xl">Fun and comfortable wear for the little ones. Quality fabrics for active explorers.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-64 flex-shrink-0">
            <SidebarFilters
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              selectedSizes={selectedSizes}
              toggleSize={toggleSize}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              availability={availability}
              toggleAvailability={(key) => setAvailability(prev => ({ ...prev, [key]: !prev[key] }))}
              fit={fit}
              toggleFit={(key) => setFit(prev => ({ ...prev, [key]: !prev[key] }))}
            />
          </div>

          <div className="flex-1">
            <ProductGrid
              products={products}
              onQuickAdd={handleQuickAdd}
              onToggleWishlist={(id) => console.log('Wishlist:', id)}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KidsPage;
