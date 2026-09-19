import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../lib/api';
import SidebarFilters from './SidebarFilters';
import ProductGrid from './ProductGrid';
import RecentlyViewed from './RecentlyViewed';
import { useCart } from '../../context/CartContext';

const Shop = ({ onProductClick, initialCategory = 'All Collection', title, description }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse search query
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  // Filter & Sort State
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [appliedSizes, setAppliedSizes] = useState([]);
  const [pendingPriceRange, setPendingPriceRange] = useState({ min: 0, max: 5000 });
  const [appliedPriceRange, setAppliedPriceRange] = useState({ min: 0, max: 5000 });
  const [availability, setAvailability] = useState({ inStock: true, outOfStock: false });
  const [fit, setFit] = useState({ slimFit: false, baggy: false });
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync category if prop changes (via routing)
  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  // Backend Product Data
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);


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
      size: product.selectedSize || 'M',
      color: product.color || 'Default',
      collection: 'LIYARA',
      maxStock: product.maxStock
    });
    navigate('/cart');
  };

  // Filtered Products
  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Price range filter
    const maxPrice = parseInt(appliedPriceRange.max, 10) || 5000;
    const minPrice = parseInt(appliedPriceRange.min, 10) || 0;
    if (product.price < minPrice || product.price > maxPrice) {
      return false;
    }
    // Category filter
    if (activeCategory !== 'All Collection' && activeCategory !== 'Recently Viewed') {
      const catName = product.Category?.name?.toLowerCase() || '';
      const filterName = activeCategory.toLowerCase().replace("'s collection", "").replace(" collection", "").trim();
      
      // Exact boundary matching to prevent 'women' from matching 'men'
      if (filterName === 'men' && (catName.includes('women') || catName.includes("women's"))) {
        return false;
      }
      
      if (!catName.includes(filterName)) return false;
    }
    
    const totalStock = (product.stockS || 0) + (product.stockM || 0) + (product.stockL || 0);

    // Availability filter
    if (availability.inStock && !availability.outOfStock) {
      if (totalStock <= 0) return false;
    }
    if (availability.outOfStock && !availability.inStock) {
      if (totalStock > 0) return false;
    }
    if (!availability.inStock && !availability.outOfStock) {
      return false;
    }

    // Size filter
    if (appliedSizes && appliedSizes.length > 0) {
      const hasAvailableSize = appliedSizes.some(size => {
        if (size === 'S' && product.stockS > 0) return true;
        if (size === 'M' && product.stockM > 0) return true;
        if (size === 'L' && product.stockL > 0) return true;
        return false;
      });
      if (!hasAvailableSize) return false;
    }



    return true;
  });

  // Apply Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'low-high') return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === 'high-low') return parseFloat(b.price) - parseFloat(a.price);
    if (sortBy === 'recent') return new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt);
    // featured (default) or any other fallback
    return 0; 
  });

  if (loading) return <div className="pt-32 min-h-screen text-center text-xl">Loading products...</div>;

  return (
    <div className="pt-32 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Dynamic Category Header */}
        {title && (
          <header className="mb-12">
            <h1 className="text-4xl font-extrabold font-outfit text-[#111] mb-2 uppercase tracking-tight">{title}</h1>
            {description && <p className="text-gray-500 max-w-2xl">{description}</p>}
          </header>
        )}

        {/* Mobile Filter Toggle Button */}
        <button 
          className="lg:hidden w-full mb-6 py-3 border border-zinc-200 text-zinc-800 rounded text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-zinc-50 transition"
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          {isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
        </button>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          {/* Sidebar */}
          <div className={`w-full lg:w-64 flex-shrink-0 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
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
              products={sortedProducts}
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
