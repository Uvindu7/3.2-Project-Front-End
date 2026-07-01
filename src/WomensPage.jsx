import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarFilters from './components/shop/SidebarFilters';
import ProductGrid from './components/shop/ProductGrid';
import { useCart } from './context/CartContext';

const WomensPage = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("Women's Collection");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [availability, setAvailability] = useState({ inStock: true, outOfStock: false });
  const [fit, setFit] = useState({ slimFit: false, baggy: false });
  const [sortBy, setSortBy] = useState('featured');

  // Sample Product Data (Filtered for Women)
  const [products] = useState([
    { id: 201, name: 'Women’s Essential Tee - White', price: 2900, image: '/images/charcoal-tee.png', category: "Women's Collection" },
    { id: 202, name: 'Women’s Crop Tee - Lavender', price: 3100, image: '/images/product-tee.png', category: "Women's Collection" },
    { id: 203, name: 'Women’s Oversized Tee - Beige', price: 3300, image: '/images/product-tee.png', category: "Women's Collection" },
    { id: 204, name: 'Women’s V-Neck Tee - Black', price: 2800, image: '/images/charcoal-tee.png', category: "Women's Collection" },
  ]);

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleQuickAdd = (product) => {
    addToCart({ ...product, size: 'M', color: 'Default', collection: 'LIYARA' });
    navigate('/cart');
  };

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold font-outfit text-[#111] mb-2 uppercase tracking-tight">WOMEN'S COLLECTION</h1>
          <p className="text-gray-500 max-w-2xl">Explore our curated collection for women, blending elegance with everyday comfort.</p>
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

export default WomensPage;
