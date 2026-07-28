import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarFilters from './SidebarFilters';
import ProductGrid from './ProductGrid';
import { useCart } from '../../context/CartContext';


const MensPage = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("Men's Collection");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [availability, setAvailability] = useState({ inStock: true, outOfStock: false });
  const [fit, setFit] = useState({ slimFit: false, baggy: false });
  const [sortBy, setSortBy] = useState('featured');

  // Sample Product Data (Filtered for Men)
  const [products] = useState([
    { id: 101, name: 'Men’s Premium Tee - Black', price: 3200, image: '/images/product-tee.png', category: "Men's Collection" },
    { id: 102, name: 'Men’s Raglan Tee - Navy', price: 2800, image: '/images/product-tee.png', category: "Men's Collection" },
    { id: 103, name: 'Men’s Slim Fit Tee - Charcoal', price: 3000, image: '/images/charcoal-tee.png', category: "Men's Collection" },
    { id: 104, name: 'Men’s Sport Tee - Grey', price: 2700, image: '/images/product-tee.png', category: "Men's Collection" },
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
          <h1 className="text-4xl font-extrabold font-outfit text-[#111] mb-2 uppercase tracking-tight">MEN'S COLLECTION</h1>
          <p className="text-gray-500 max-w-2xl">Discover our premium range of men's apparel, designed for comfort and style.</p>
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

export default MensPage;
